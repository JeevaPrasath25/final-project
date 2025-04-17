
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      if (!user) return;
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // Create initial profile if it doesn't exist
        const newProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'Architect',
          email: user.email,
          role: 'architect',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        // Check if storage bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.find(bucket => bucket.name === 'profiles')) {
          await supabase.storage.createBucket('profiles', {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
        }

        // Use upsert to avoid conflicts
        const { error: insertError, data: insertData } = await supabase
          .from('users')
          .upsert(newProfile, { 
            onConflict: 'id'
          })
          .select(); // Add explicit select to get response data

        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }

        // TypeScript safe handling of insertData
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

  const uploadProfileImage = async () => {
    if (!profileImage || !user) return null;

    setUploadingProfileImage(true);
    try {
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      // First check if profiles bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'profiles')) {
        await supabase.storage.createBucket('profiles', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, profileImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      toast({
        variant: "destructive",
        title: "Error uploading profile image",
        description: error.message,
      });
      return null;
    } finally {
      setUploadingProfileImage(false);
    }
  };

  const updateProfile = async (values: any) => {
    try {
      setIsLoading(true);
      if (!user) return false;
      
      let avatar_url = profileData?.avatar_url;
      if (profileImage) {
        const publicUrl = await uploadProfileImage();
        if (publicUrl) {
          avatar_url = publicUrl;
        }
      }

      const updates = {
        id: user.id, // Ensure id is always included
        username: values.username,
        email: user.email, // Keep email in sync with auth
        role: 'architect', // Maintain role
        contact_details: values.contact_number,
        bio: values.bio,
        avatar_url,
        updated_at: new Date().toISOString(),
        experience: values.experience || profileData?.experience,
        skills: values.skills || profileData?.skills,
        education: values.education || profileData?.education,
        social_links: values.location || profileData?.social_links,
        contact_email: values.business_email || profileData?.contact_email
      };

      // Use upsert to create or update the profile
      const { error, data } = await supabase
        .from('users')
        .upsert(updates, {
          onConflict: 'id'
        })
        .select(); // Add explicit select to get response data

      if (error) throw error;

      // TypeScript safe handling of data
      let updatedProfile = updates; // Default to updates object
      if (data && data[0]) {
        updatedProfile = data[0];
      }
      setProfileData(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
      return false;
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
    uploadingProfileImage,
    setProfileImage,
    updateProfile,
    fetchProfileData
  };
};
