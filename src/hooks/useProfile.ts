
import { useAuth } from "@/contexts/AuthContext";
import { useFetchProfile } from "./profile/useFetchProfile";
import { useProfileImage } from "./profile/useProfileImage";
import { useUpdateProfile } from "./profile/useUpdateProfile";

export const useProfile = () => {
  const { user } = useAuth();
  
  // Use the separate hooks for each functionality
  const {
    isLoading,
    profileData,
    profileImageUrl,
    setProfileData,
    fetchProfileData
  } = useFetchProfile();
  
  const {
    profileImage,
    setProfileImage,
    uploadingProfileImage,
    uploadProfileImage
  } = useProfileImage(user);
  
  const {
    isUpdating,
    updateProfile
  } = useUpdateProfile(user, profileData, setProfileData, uploadProfileImage);

  // Combine the loading states
  const combinedIsLoading = isLoading || isUpdating;

  // Return all necessary functions and state
  return {
    isLoading: combinedIsLoading,
    profileData,
    profileImageUrl,
    profileImage,
    setProfileImage,
    uploadingProfileImage,
    updateProfile,
    fetchProfileData, // Make sure to expose this function
    setProfileData
  };
};
