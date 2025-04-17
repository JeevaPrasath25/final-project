
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
      
      // Upload profile image if one is selected
      let avatar_url = profileData?.avatar_url;
      const publicUrl = await uploadProfileImage();
      if (publicUrl) {
        avatar_url = publicUrl;
        console.log("New profile image URL:", avatar_url);
      }

      // Get the user's role
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const userRole = authUser?.user_metadata?.role || profileData?.role || 'homeowner';

      // Create a base update object
      const updates = {
        id: user.id,
        username: values.username || profileData?.username,
        email: user.email,
        role: userRole,
        contact_details: values.contact_number || profileData?.contact_details || null,
        bio: values.bio || profileData?.bio || null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString(),
      };

      // Add role-specific fields
      if (userRole === 'architect') {
        Object.assign(updates, {
          experience: values.experience || profileData?.experience || null,
          skills: values.skills || profileData?.skills || null,
          education: values.education || profileData?.education || null,
          social_links: values.social_links || profileData?.social_links || null,
          contact_email: values.business_email || profileData?.contact_email || null
        });
      } else if (userRole === 'homeowner') {
        Object.assign(updates, {
          preferences: values.preferences || profileData?.preferences || null,
          project_type: values.project_type || profileData?.project_type || null,
        });
      }

      console.log("Sending profile update:", updates);

      const { data, error } = await supabase
        .from('users')
        .upsert(updates, { 
          onConflict: 'id',
          ignoreDuplicates: false,
        });

      if (error) {
        console.error("Profile update error:", error);
        throw error;
      }

      console.log("Profile updated successfully");
      
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
