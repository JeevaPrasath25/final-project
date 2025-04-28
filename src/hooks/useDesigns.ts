import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Design } from "@/types/design";

export const useDesigns = (architectId?: string) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDesigns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let query = supabase
        .from('posts')
        .select(`*`);
      
      if (architectId) {
        query = query.eq('user_id', architectId);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (!data) {
        setDesigns([]);
        setIsLoading(false);
        return;
      }

      const designsData = data as any[];
      
      const formattedDesigns: Design[] = await Promise.all(designsData.map(async (design) => {
        let userLiked = false;
        let userSaved = false;
        let likesCount = 0;
        let savesCount = 0;

        const { count: likesCountData, error: likesError } = await supabase
          .from('design_likes')
          .select('*', { count: 'exact', head: false })
          .eq('design_id', design.id);
          
        if (!likesError) {
          likesCount = likesCountData || 0;
        }
        
        const { count: savesCountData, error: savesError } = await supabase
          .from('design_saves')
          .select('*', { count: 'exact', head: false })
          .eq('design_id', design.id);
          
        if (!savesError) {
          savesCount = savesCountData || 0;
        }

        if (user) {
          const { data: likeData } = await supabase
            .from('design_likes')
            .select()
            .eq('design_id', design.id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          const { data: saveData } = await supabase
            .from('design_saves')
            .select()
            .eq('design_id', design.id)
            .eq('user_id', user.id)
            .maybeSingle();

          userLiked = !!likeData;
          userSaved = !!saveData;
        }

        const metadata = design.metadata || {};
        const category = metadata.category || "inspiration";

        return {
          id: design.id,
          title: design.title,
          image_url: design.image_url,
          user_id: design.user_id,
          created_at: design.created_at,
          liked_by_user: userLiked,
          saved_by_user: userSaved,
          design_likes: { count: likesCount },
          design_saves: { count: savesCount },
          metadata: metadata,
          category: category,
          rooms: category === "floorplan" ? metadata.rooms : undefined,
          size: category === "floorplan" ? metadata.squareFeet : undefined,
          style: category === "inspiration" ? metadata.designType : undefined
        };
      }));
      
      setDesigns(formattedDesigns);
    } catch (err: any) {
      console.error("Error fetching designs:", err);
      setError(err.message || "Failed to load designs");
      toast({
        variant: "destructive",
        title: "Failed to load designs",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLikeDesign = async (id: string, liked: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to like designs",
        variant: "destructive",
      });
      return;
    }

    try {
      if (liked) {
        await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('design_likes')
          .insert({
            design_id: id,
            user_id: user.id
          });
      }

      setDesigns(designs.map(design => {
        if (design.id === id) {
          const likesCount = design.design_likes?.count || 0;
          return {
            ...design,
            liked_by_user: !liked,
            design_likes: {
              count: liked ? Math.max(0, likesCount - 1) : likesCount + 1
            }
          };
        }
        return design;
      }));
    } catch (err) {
      console.error("Error toggling like:", err);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Please try again",
      });
    }
  };

  const toggleSaveDesign = async (id: string, saved: boolean) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to log in to save designs",
        variant: "destructive",
      });
      return;
    }

    try {
      if (saved) {
        await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', id)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('design_saves')
          .insert({
            design_id: id,
            user_id: user.id
          });
      }

      setDesigns(designs.map(design => {
        if (design.id === id) {
          const savesCount = design.design_saves?.count || 0;
          return {
            ...design,
            saved_by_user: !saved,
            design_saves: {
              count: saved ? Math.max(0, savesCount - 1) : savesCount + 1
            }
          };
        }
        return design;
      }));
    } catch (err) {
      console.error("Error toggling save:", err);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Please try again",
      });
    }
  };

  const deleteDesign = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to delete designs",
        variant: "destructive",
      });
      return;
    }

    try {
      const design = designs.find(d => d.id === id);
      if (!design || design.user_id !== user.id) {
        toast({
          title: "Permission Denied",
          description: "You can only delete your own designs",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDesigns(designs.filter(design => design.id !== id));

      toast({
        title: "Design Deleted",
        description: "The design has been successfully deleted",
      });
    } catch (err) {
      console.error("Error deleting design:", err);
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "Please try again",
      });
    }
  };

  const updateDesign = async (id: string, updates: Partial<Omit<Design, 'id'>>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to update designs",
        variant: "destructive",
      });
      return false;
    }

    try {
      const design = designs.find(d => d.id === id);
      if (!design || design.user_id !== user.id) {
        toast({
          title: "Permission Denied",
          description: "You can only update your own designs",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setDesigns(designs.map(design => {
        if (design.id === id) {
          return { ...design, ...updates };
        }
        return design;
      }));

      toast({
        title: "Design Updated",
        description: "The design has been successfully updated",
      });
      
      return true;
    } catch (err) {
      console.error("Error updating design:", err);
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "Please try again",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [architectId, user]);

  return {
    designs,
    isLoading,
    error,
    toggleLikeDesign,
    toggleSaveDesign,
    deleteDesign,
    updateDesign,
    fetchDesigns
  };
};
