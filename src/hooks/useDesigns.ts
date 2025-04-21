
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

  // Fetch designs (uploaded by architects)
  useEffect(() => {
    let subscription: any;
    async function fetchDesigns() {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming 'designs' table has image_url, title, architect_id, style, rooms, size, created_at, featured
        // And a 'users' table mapping architect_id to username
        const { data, error } = await supabase
          .from("designs")
          .select(`
            id, image_url, title, style, rooms, size, created_at, featured, 
            architect:user_id ( id, username )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setDesigns(
            data.map((d: any) => ({
              id: d.id,
              image_url: d.image_url,
              title: d.title,
              style: d.style,
              rooms: d.rooms,
              size: d.size,
              date: d.created_at,
              featured: d.featured,
              architect_name: d.architect?.username || "Architect",
              architect_id: d.architect?.id || "",
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

    // Supabase real-time subscription to 'designs' table
    try {
      subscription = supabase
        .channel('public:designs')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'designs' },
          (payload: any) => {
            // Refetch on update
            fetchDesigns();
          }
        )
        .subscribe();
    } catch (e) {
      // Real-time may not be available, fail silently
    }

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  return { designs, isLoading, error };
}
