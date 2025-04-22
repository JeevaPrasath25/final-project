
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useDesigns } from "@/hooks/useDesigns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ArchitectInfo from "@/components/architect/ArchitectInfo";
import ArchitectDesigns from "@/components/architect/ArchitectDesigns";

const ArchitectProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  
  const {
    isLoading,
    profileData,
    profileImageUrl,
    setProfileImage,
    uploadingProfileImage,
    updateProfile,
    fetchProfileData
  } = useProfile();
  
  const {
    designs,
    designImage,
    uploadingDesign,
    setDesignImage,
    uploadDesign,
    uploadDesignImage,
    toggleLikeDesign,
    toggleSaveDesign,
    deleteDesign
  } = useDesigns();

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to view your profile",
      });
      navigate("/login");
    }
  }, [user, authLoading, navigate, toast]);
  
  const handleProfileFormSubmit = async (values: any) => {
    try {
      const success = await updateProfile(values);
      if (success) {
        await fetchProfileData();
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
      });
    }
  };

  if ((isLoading && !profileData) || authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-design-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <ProfileHeader
              profileData={profileData}
              profileImageUrl={profileImageUrl}
              isEditing={isEditing}
              uploadingProfileImage={uploadingProfileImage}
              setProfileImage={setProfileImage}
              setIsEditing={setIsEditing}
            />

            {isEditing ? (
              <div className="mt-8">
                <ProfileForm
                  profileData={profileData}
                  isLoading={isLoading}
                  onSubmit={handleProfileFormSubmit}
                />
              </div>
            ) : (
              <ArchitectInfo profileData={profileData} user={user} />
            )}
          </div>

          <ArchitectDesigns
            designs={designs}
            designImage={designImage}
            uploadingDesign={uploadingDesign}
            setDesignImage={setDesignImage}
            uploadDesign={uploadDesign}
            uploadDesignImage={uploadDesignImage}
            toggleLikeDesign={toggleLikeDesign}
            toggleSaveDesign={toggleSaveDesign}
            deleteDesign={deleteDesign}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchitectProfilePage;
