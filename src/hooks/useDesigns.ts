
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Design {
  id: string;
  image_url: string;
  title: string;
  architect_name: string;
  architect_id: string;
  user_id: string;
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

  const fetchDesigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get user data if available, but continue if not authenticated
      let userData = null;
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!authError) {
          userData = user;
        }
      } catch (authError) {
        console.log("Not authenticated or auth error:", authError);
        // Continue without user data
      }
      
      const { data, error } = await supabase
        .from("posts")
        .select(`
          id,
          image_url,
          title,
          design_type,
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
        // Fetch likes and saves, but handle potential errors
        let likesData = [];
        let savesData = [];
        
        try {
          const { data: likesResponse } = await supabase
            .from("design_likes")
            .select("design_id, count")
            .in("design_id", data.map((d: any) => d.id));
            
          if (likesResponse) {
            likesData = likesResponse;
          }
        } catch (likesError) {
          console.error("Error fetching likes:", likesError);
        }
        
        try {
          const { data: savesResponse } = await supabase
            .from("design_saves")
            .select("design_id, count")
            .in("design_id", data.map((d: any) => d.id));
            
          if (savesResponse) {
            savesData = savesResponse;
          }
        } catch (savesError) {
          console.error("Error fetching saves:", savesError);
        }
        
        let userLikes: string[] = [];
        let userSaves: string[] = [];
        
        if (userData) {
          try {
            const { data: userLikesData } = await supabase
              .from("design_likes")
              .select("design_id")
              .eq("user_id", userData.id);
              
            const { data: userSavesData } = await supabase
              .from("design_saves")
              .select("design_id")
              .eq("user_id", userData.id);
              
            userLikes = userLikesData?.map(item => item.design_id) || [];
            userSaves = userSavesData?.map(item => item.design_id) || [];
          } catch (userDataError) {
            console.error("Error fetching user likes/saves:", userDataError);
          }
        }
        
        setDesigns(
          data.map((d: any) => {
            const designLikes = likesData?.find((l: any) => l.design_id === d.id);
            const designSaves = savesData?.find((s: any) => s.design_id === d.id);
            
            return {
              id: d.id,
              image_url: d.image_url,
              title: d.title,
              style: d.design_type, // Use design_type as style
              date: d.created_at,
              architect_name: d.user?.username || "Unknown Architect",
              architect_id: d.user?.id || "",
              user_id: d.user_id,
              liked_by_user: userLikes.includes(d.id),
              saved_by_user: userSaves.includes(d.id),
              design_likes: { count: designLikes?.count || 0 },
              design_saves: { count: designSaves?.count || 0 }
            };
          })
        );
      }
    } catch (err: any) {
      console.error("Error in fetchDesigns:", err);
      setError("Could not load designs. Please check your connection and try again later.");
      toast({
        variant: "destructive",
        title: "Error loading designs",
        description: "Could not load designs. Please check your connection and try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();

    // Set up realtime subscription only if Supabase is available
    try {
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
    } catch (subscriptionError) {
      console.error("Error setting up realtime subscription:", subscriptionError);
      // Continue without realtime updates
    }
  }, []);

  const uploadDesignImage = async (): Promise<string | null> => {
    if (!designImage) return null;
    
    try {
      setUploadingDesign(true);
      
      const fileExt = designImage.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('designs')
        .upload(filePath, designImage);
        
      if (uploadError) throw uploadError;
      
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

      if (data) {
        const newDesign: Design = {
          id: data.id,
          image_url: data.image_url,
          title: data.title,
          architect_name: user.user_metadata.username || "Unknown Architect",
          architect_id: user.id,
          user_id: user.id,
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
        await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('design_likes')
          .insert([{ design_id: designId, user_id: user.id }]);
      }

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
        await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('design_saves')
          .insert([{ design_id: designId, user_id: user.id }]);
      }

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
