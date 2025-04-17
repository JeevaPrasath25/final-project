
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Define the shape of our design data
export interface Design {
  id: string;
  title: string;
  image_url: string;
  user_id: string;
  created_at: string;
  liked_by_user: boolean;
  saved_by_user: boolean;
  design_likes: { count: number };
  design_saves: { count: number };
}

// Create a type for the Supabase client with 'any' for unknown tables
type AnyTable = any;
type SupabaseAnyQuery = {
  from: (table: string) => AnyTable;
};

export const useDesigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const fetchDesigns = async () => {
    try {
      if (!user) return;

      // Use the any-typed supabase query for tables not in the type definitions
      const anySupabase = supabase as unknown as SupabaseAnyQuery;
      
      const { data: designsData, error } = await anySupabase
        .from('designs')
        .select('*')
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Process each design to check likes and saves
      const designsWithUserActions = await Promise.all(
        (designsData || []).map(async (design) => {
          // Check if user has liked the design
          const { data: likeData, error: likeError } = await anySupabase
            .from('design_likes')
            .select('*')
            .eq("design_id", design.id)
            .eq("user_id", user.id)
            .maybeSingle();

          // Check if user has saved the design
          const { data: saveData, error: saveError } = await anySupabase
            .from('design_saves')
            .select('*')
            .eq("design_id", design.id)
            .eq("user_id", user.id)
            .maybeSingle();

          // Count likes for the design
          const { count: likesCount } = await anySupabase
            .from('design_likes')
            .select('*', { count: "exact", head: true })
            .eq("design_id", design.id);

          // Count saves for the design
          const { count: savesCount } = await anySupabase
            .from('design_saves')
            .select('*', { count: "exact", head: true })
            .eq("design_id", design.id);

          return {
            ...design,
            liked_by_user: !!likeData,
            saved_by_user: !!saveData,
            design_likes: { count: likesCount || 0 },
            design_saves: { count: savesCount || 0 }
          } as Design;
        })
      );

      setDesigns(designsWithUserActions);
    } catch (error: any) {
      console.error("Error fetching designs:", error);
      toast({
        variant: "destructive",
        title: "Error fetching designs",
        description: error.message,
      });
    }
  };

  const uploadDesignImage = async () => {
    if (!designImage || !user) return null;

    setUploadingDesign(true);
    try {
      const fileExt = designImage.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('designs')
        .upload(fileName, designImage);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('designs').getPublicUrl(fileName);
      
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Error uploading design image:", error);
      toast({
        variant: "destructive",
        title: "Error uploading design image",
        description: error.message,
      });
      return null;
    } finally {
      setUploadingDesign(false);
    }
  };

  const uploadDesign = async (title: string, imageUrl: string) => {
    try {
      if (!user) return false;
      setUploadingDesign(true);

      // Use the any-typed supabase query
      const anySupabase = supabase as unknown as SupabaseAnyQuery;
      
      const { error } = await anySupabase
        .from('designs')
        .insert({
          user_id: user.id,
          title,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: "Design uploaded",
        description: "Your design has been uploaded successfully",
      });
      
      // Refresh designs
      fetchDesigns();
      return true;
    } catch (error: any) {
      console.error("Error uploading design:", error);
      toast({
        variant: "destructive",
        title: "Error uploading design",
        description: error.message,
      });
      return false;
    } finally {
      setUploadingDesign(false);
    }
  };

  const toggleLikeDesign = async (designId: string, currentlyLiked: boolean) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to like designs",
        });
        return;
      }

      // Use the any-typed supabase query
      const anySupabase = supabase as unknown as SupabaseAnyQuery;

      if (currentlyLiked) {
        // Unlike the design
        const { error } = await anySupabase
          .from('design_likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like the design
        const { error } = await anySupabase
          .from('design_likes')
          .insert({
            design_id: designId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update designs state
      setDesigns(designs.map(design => {
        if (design.id === designId) {
          return {
            ...design,
            liked_by_user: !currentlyLiked,
            design_likes: {
              count: currentlyLiked 
                ? design.design_likes.count - 1 
                : design.design_likes.count + 1
            }
          };
        }
        return design;
      }));
    } catch (error: any) {
      console.error("Error updating like:", error);
      toast({
        variant: "destructive",
        title: "Error updating like",
        description: error.message,
      });
    }
  };

  const toggleSaveDesign = async (designId: string, currentlySaved: boolean) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to save designs",
        });
        return;
      }

      // Use the any-typed supabase query
      const anySupabase = supabase as unknown as SupabaseAnyQuery;

      if (currentlySaved) {
        // Unsave the design
        const { error } = await anySupabase
          .from('design_saves')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Save the design
        const { error } = await anySupabase
          .from('design_saves')
          .insert({
            design_id: designId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update designs state
      setDesigns(designs.map(design => {
        if (design.id === designId) {
          return {
            ...design,
            saved_by_user: !currentlySaved,
            design_saves: {
              count: currentlySaved 
                ? design.design_saves.count - 1 
                : design.design_saves.count + 1
            }
          };
        }
        return design;
      }));
    } catch (error: any) {
      console.error("Error updating save:", error);
      toast({
        variant: "destructive",
        title: "Error updating save",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchDesigns();
    }
  }, [user]);

  return {
    designs,
    setDesignImage,
    designImage,
    uploadingDesign,
    uploadDesignImage,
    uploadDesign,
    toggleLikeDesign,
    toggleSaveDesign,
    fetchDesigns,
    generatedImage,
    setGeneratedImage
  };
};
