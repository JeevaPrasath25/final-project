
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useFetchProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      
      // Check if profiles bucket exists and create it if not
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'profiles')) {
        await supabase.storage.createBucket('profiles', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
      
      // Get user metadata to determine role
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userRole = authUser?.user_metadata?.role || 'homeowner';
      
      // Query for existing profile by user ID
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create new profile if doesn't exist, with appropriate fields based on role
        const newProfile = {
          id: user.id,
          username: authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'User',
          email: user.email,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError, data: insertData } = await supabase
          .from('users')
          .upsert(newProfile)
          .select();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        if (insertData && insertData[0]) {
          setProfileData(insertData[0]);
        } else {
          setProfileData(newProfile);
        }
      } else {
        setProfileData(data);
        
        if (data.avatar_url) {
          setProfileImageUrl(data.avatar_url);
        }
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  return {
    isLoading,
    profileData,
    profileImageUrl,
    setProfileData,
    setProfileImageUrl,
    fetchProfileData,
  };
};
