
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Design {
  id: string;
  image_url: string;
  title: string;
  architect_name: string;
  architect_id: string;
  style?: string;
  rooms?: number;
  size?: number;
  date?: string;
  featured?: boolean;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  design_likes?: { count: number };
  design_saves?: { count: number };
}

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const { toast } = useToast();

  // Function to fetch designs
  const fetchDesigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get all designs by architects
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          image_url,
          title,
          design_type as style,
          created_at,
          user_id,
          user:user_id (
            id,
            username,
            role
          )
        `)
        .eq('user.role', 'architect');
      
      if (error) throw error;
      
      if (data) {
        // Get design likes count
        const { data: likesData, error: likesError } = await supabase
          .from("design_likes")
          .select("design_id, count", { count: "exact" })
          .in("design_id", data.map((d: any) => d.id))
          .group('design_id');

        // Get design saves count
        const { data: savesData, error: savesError } = await supabase
          .from("design_saves")
          .select("design_id, count", { count: "exact" })
          .in("design_id", data.map((d: any) => d.id))
          .group('design_id');
          
        // Check if current user liked/saved any designs
        let userLikes: string[] = [];
        let userSaves: string[] = [];
        
        if (user) {
          const { data: userLikesData } = await supabase
            .from("design_likes")
            .select("design_id")
            .eq("user_id", user.id);
            
          const { data: userSavesData } = await supabase
            .from("design_saves")
            .select("design_id")
            .eq("user_id", user.id);
            
          userLikes = userLikesData?.map(item => item.design_id) || [];
          userSaves = userSavesData?.map(item => item.design_id) || [];
        }
        
        // Process and combine data
        setDesigns(
          data.map((d: any) => {
            const designLikes = likesData?.find((l: any) => l.design_id === d.id);
            const designSaves = savesData?.find((s: any) => s.design_id === d.id);
            
            return {
              id: d.id,
              image_url: d.image_url,
              title: d.title,
              style: d.style,
              date: d.created_at,
              architect_name: d.user?.username || "Unknown Architect",
              architect_id: d.user?.id || "",
              user_id: d.user_id, // Add user_id to help with filtering
              liked_by_user: userLikes.includes(d.id),
              saved_by_user: userSaves.includes(d.id),
              design_likes: { count: designLikes?.count || 0 },
              design_saves: { count: designSaves?.count || 0 }
            };
          })
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to load designs");
      toast({
        variant: "destructive",
        title: "Error loading designs",
        description: err.message || "Failed to load designs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();

    // Set up real-time subscription
    const channel = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchDesigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Implement design upload functions
  const uploadDesignImage = async (): Promise<string | null> => {
    if (!designImage) return null;
    
    try {
      setUploadingDesign(true);
      
      // Generate a unique file name
      const fileExt = designImage.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('designs')
        .upload(filePath, designImage);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload the image",
      });
      return null;
    } finally {
      setUploadingDesign(false);
    }
  };

  const uploadDesign = async (title: string, imageUrl: string): Promise<boolean> => {
    try {
      setUploadingDesign(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to upload designs");
      
      const { error, data } = await supabase
        .from('posts')
        .insert([
          { 
            title,
            image_url: imageUrl,
            user_id: user.id,
          }
        ])
        .select()
        .single();
        
      if (error) throw error;

      // Update local state immediately after successful upload
      if (data) {
        const newDesign: Design = {
          id: data.id,
          image_url: data.image_url,
          title: data.title,
          architect_name: user.user_metadata.username || "Unknown Architect",
          architect_id: user.id,
          user_id: user.id, // Add user_id for filtering
          date: data.created_at,
          liked_by_user: false,
          saved_by_user: false,
          design_likes: { count: 0 },
          design_saves: { count: 0 }
        };
        setDesigns(prev => [newDesign, ...prev]);
      }
      
      toast({
        title: "Design uploaded",
        description: "Your design has been uploaded successfully",
      });
      
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload the design",
      });
      return false;
    } finally {
      setUploadingDesign(false);
    }
  };

  const toggleLikeDesign = async (designId: string, isLiked: boolean): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to like designs",
        });
        return;
      }

      if (isLiked) {
        // Unlike
        await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('design_likes')
          .insert([{ design_id: designId, user_id: user.id }]);
      }

      // Update the designs array to reflect the change
      setDesigns(prev => 
        prev.map(design => {
          if (design.id === designId) {
            const likesCount = isLiked 
              ? (design.design_likes?.count || 1) - 1 
              : (design.design_likes?.count || 0) + 1;
            return {
              ...design,
              liked_by_user: !isLiked,
              design_likes: { count: likesCount }
            };
          }
          return design;
        })
      );

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: error.message || "Failed to like/unlike the design",
      });
    }
  };

  const toggleSaveDesign = async (designId: string, isSaved: boolean): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to save designs",
        });
        return;
      }

      if (isSaved) {
        // Unsave
        await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);
      } else {
        // Save
        await supabase
          .from('design_saves')
          .insert([{ design_id: designId, user_id: user.id }]);
      }

      // Update the designs array to reflect the change
      setDesigns(prev => 
        prev.map(design => {
          if (design.id === designId) {
            const savesCount = isSaved 
              ? (design.design_saves?.count || 1) - 1 
              : (design.design_saves?.count || 0) + 1;
            return {
              ...design,
              saved_by_user: !isSaved,
              design_saves: { count: savesCount }
            };
          }
          return design;
        })
      );

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: error.message || "Failed to save/unsave the design",
      });
    }
  };

  const deleteDesign = async (designId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You must be logged in to delete designs",
        });
        return;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', designId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove the deleted design from the array
      setDesigns(prev => prev.filter(design => design.id !== designId));

      toast({
        title: "Design deleted",
        description: "Your design has been deleted successfully",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || "Failed to delete the design",
      });
    }
  };

  return {
    designs,
    isLoading,
    error,
    designImage,
    setDesignImage,
    uploadingDesign,
    uploadDesign,
    uploadDesignImage,
    toggleLikeDesign,
    toggleSaveDesign,
    deleteDesign,
    fetchDesigns
  };
}
