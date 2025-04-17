
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export const useUpdateProfile = (
  user: User | null,
  profileData: any,
  setProfileData: (data: any) => void,
  uploadProfileImage: () => Promise<string | null>
) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfile = async (values: any) => {
    try {
      setIsUpdating(true);
      if (!user) return false;
      
      console.log("Starting profile update for user:", user.id);
      console.log("Current profile data:", profileData);
      console.log("Update values:", values);
      
      // Upload profile image if one is selected
      let avatar_url = profileData?.avatar_url;
      const publicUrl = await uploadProfileImage();
      if (publicUrl) {
        avatar_url = publicUrl;
        console.log("New profile image URL:", avatar_url);
      }

      // Create a clean update object with only non-null values
      const updates = {
        id: user.id,
        username: values.username || profileData?.username,
        email: user.email,
        role: 'architect',
        contact_details: values.contact_number || null,
        bio: values.bio || null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString(),
        experience: values.experience || null,
        skills: values.skills || null,
        education: values.education || null,
        social_links: values.location || null,
        contact_email: values.business_email || null
      };

      console.log("Sending profile update:", updates);

      const { error } = await supabase
        .from('users')
        .upsert(updates, { 
          onConflict: 'id',
          ignoreDuplicates: false,
        })
        .select();

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      // Fetch updated profile data
      const { data: updatedProfileData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError) {
        console.error("Fetch error after update:", fetchError);
        throw fetchError;
      }

      console.log("Updated profile data:", updatedProfileData);
      setProfileData(updatedProfileData);
      
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
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateProfile
  };
};
