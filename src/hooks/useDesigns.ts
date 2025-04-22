
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    let subscription: any;
    
    async function fetchDesigns() {
      setIsLoading(true);
      setError(null);
      try {
        // Join with users table to get architect information
        const { data, error } = await supabase
          .from("posts")
          .select(`
            id,
            image_url,
            title,
            design_type as style,
            created_at,
            user:user_id (
              id,
              username,
              role
            )
          `)
          .eq('user.role', 'architect')
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data) {
          setDesigns(
            data.map((d: any) => ({
              id: d.id,
              image_url: d.image_url,
              title: d.title,
              style: d.style,
              date: d.created_at,
              architect_name: d.user?.username || "Unknown Architect",
              architect_id: d.user?.id || "",
              liked_by_user: false,
              saved_by_user: false,
              design_likes: { count: 0 },
              design_saves: { count: 0 }
            }))
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load designs");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDesigns();

    // Set up real-time subscription
    try {
      subscription = supabase
        .channel('posts_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts' },
          () => {
            fetchDesigns();
          }
        )
        .subscribe();
    } catch (e) {
      // Real-time subscription failed silently
    }

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return { designs, isLoading, error };
}
