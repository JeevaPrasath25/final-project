
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
      
      let avatar_url = profileData?.avatar_url;
      
      // Upload profile image if one is selected
      const publicUrl = await uploadProfileImage();
      if (publicUrl) {
        avatar_url = publicUrl;
      }

      // Prepare update data - ensure we don't send any undefined values that could cause JSON errors
      const updates = {
        id: user.id,
        username: values.username || profileData?.username,
        email: user.email,
        role: 'architect',
        contact_details: values.contact_number || profileData?.contact_details || null,
        bio: values.bio || profileData?.bio || null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString(),
        experience: values.experience || profileData?.experience || null,
        skills: values.skills || profileData?.skills || null,
        education: values.education || profileData?.education || null,
        social_links: values.location || profileData?.social_links || null,
        contact_email: values.business_email || profileData?.contact_email || null
      };

      // Clean the updates object to remove any undefined values
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });

      console.log("Sending profile update:", JSON.stringify(updates));

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error("Update error:", error);
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
