
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
        // Create new profile if doesn't exist
        const newProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'Architect',
          email: user.email,
          role: 'architect',
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
