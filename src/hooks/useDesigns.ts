
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Design {
  id: string;
  title: string;
  image_url: string;
  architect_id?: string;
  user_id: string;
  created_at: string;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  design_likes?: { count: number };
  design_saves?: { count: number };
  metadata?: {
    category: 'floorplan' | 'inspiration';
    designType?: string;
    rooms?: number;
    squareFeet?: number;
    [key: string]: any;
  };
}

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
        .select(`
          id,
          title,
          image_url,
          user_id,
          created_at,
          metadata,
          design_likes: design_likes_count(*),
          design_saves: design_saves_count(*)
        `);
      
      // If architectId is provided, filter designs by that architect
      if (architectId) {
        query = query.eq('user_id', architectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (user) {
        // For each design, check if the current user has liked or saved it
        const enhancedDesigns = await Promise.all(data.map(async (design) => {
          // Check if user liked this design
          const { data: likeData } = await supabase
            .from('design_likes')
            .select()
            .eq('design_id', design.id)
            .eq('user_id', user.id)
            .maybeSingle();
          
          // Check if user saved this design
          const { data: saveData } = await supabase
            .from('design_saves')
            .select()
            .eq('design_id', design.id)
            .eq('user_id', user.id)
            .maybeSingle();

          return {
            ...design,
            liked_by_user: !!likeData,
            saved_by_user: !!saveData
          };
        }));
        
        setDesigns(enhancedDesigns);
      } else {
        setDesigns(data as Design[]);
      }
    } catch (err: any) {
      console.error("Error fetching designs:", err);
      setError(err.message);
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
        // Unlike the design
        await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', id)
          .eq('user_id', user.id);
      } else {
        // Like the design
        await supabase
          .from('design_likes')
          .insert({
            design_id: id,
            user_id: user.id
          });
      }

      // Update the designs state
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
        // Unsave the design
        await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', id)
          .eq('user_id', user.id);
      } else {
        // Save the design
        await supabase
          .from('design_saves')
          .insert({
            design_id: id,
            user_id: user.id
          });
      }

      // Update the designs state
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
      // Check if user is the owner of this design
      const design = designs.find(d => d.id === id);
      if (!design || design.user_id !== user.id) {
        toast({
          title: "Permission Denied",
          description: "You can only delete your own designs",
          variant: "destructive",
        });
        return;
      }

      // Delete the design
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the designs state
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
      // Check if user is the owner of this design
      const design = designs.find(d => d.id === id);
      if (!design || design.user_id !== user.id) {
        toast({
          title: "Permission Denied",
          description: "You can only update your own designs",
          variant: "destructive",
        });
        return false;
      }

      // Update the design
      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update the designs state
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
