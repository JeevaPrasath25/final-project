
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

export const useDesigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);

  const fetchDesigns = async () => {
    try {
      if (!user) return;

      // Use a more generic query approach with type casting
      const { data: designsData, error } = await supabase
        .from('designs')
        .select('*')
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }) as { data: any[], error: any };

      if (error) throw error;

      // Process each design to check likes and saves
      const designsWithUserActions = await Promise.all(
        (designsData || []).map(async (design) => {
          // Check if user has liked the design
          const { data: likeData, error: likeError } = await supabase
            .from('design_likes')
            .select('*')
            .eq("design_id", design.id)
            .eq("user_id", user.id)
            .maybeSingle() as { data: any, error: any };

          // Check if user has saved the design
          const { data: saveData, error: saveError } = await supabase
            .from('design_saves')
            .select('*')
            .eq("design_id", design.id)
            .eq("user_id", user.id)
            .maybeSingle() as { data: any, error: any };

          // Count likes for the design
          const { count: likesCount } = await supabase
            .from('design_likes')
            .select('*', { count: "exact", head: true })
            .eq("design_id", design.id) as { count: number };

          // Count saves for the design
          const { count: savesCount } = await supabase
            .from('design_saves')
            .select('*', { count: "exact", head: true })
            .eq("design_id", design.id) as { count: number };

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
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, designImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('designs').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
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

      // Use type casting for the insert operation
      const { error } = await supabase
        .from('designs')
        .insert({
          user_id: user.id,
          title,
          image_url: imageUrl,
        }) as { error: any };

      if (error) throw error;

      toast({
        title: "Design uploaded",
        description: "Your design has been uploaded successfully",
      });
      
      // Refresh designs
      fetchDesigns();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading design",
        description: error.message,
      });
      return false;
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

      if (currentlyLiked) {
        // Unlike the design
        const { error } = await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id) as { error: any };

        if (error) throw error;
      } else {
        // Like the design
        const { error } = await supabase
          .from('design_likes')
          .insert({
            design_id: designId,
            user_id: user.id,
          }) as { error: any };

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

      if (currentlySaved) {
        // Unsave the design
        const { error } = await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id) as { error: any };

        if (error) throw error;
      } else {
        // Save the design
        const { error } = await supabase
          .from('design_saves')
          .insert({
            design_id: designId,
            user_id: user.id,
          }) as { error: any };

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
  };
};
