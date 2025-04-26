import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ArchitectDesigns from "@/components/architect/ArchitectDesigns";
import ArchitectInfo from "@/components/architect/ArchitectInfo";
import { useProfile } from "@/hooks/useProfile";

const MyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isLoading, 
    profileData, 
    profileImageUrl,
    profileImage,
    setProfileImage,
    updateProfile,
    uploadingProfileImage
  } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Only redirect if not authenticated after auth has finished loading
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to view your profile",
      });
      navigate("/login");
    }
  }, [user, authLoading, navigate, toast]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <ProfileHeader 
              profileData={profileData}
              profileImageUrl={profileImageUrl}
              isEditing={isEditing}
              uploadingProfileImage={uploadingProfileImage}
              setProfileImage={setProfileImage}
              setIsEditing={setIsEditing}
            />

            <div className="border-t border-gray-100 mt-8 pt-8">
              {isEditing ? (
                <div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    updateProfile();
                    setIsEditing(false);
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.username || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, username: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border rounded-md bg-gray-50"
                          value={user?.email || ''}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Specialization
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.skills || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, skills: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Experience
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.experience || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, experience: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Education
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.education || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, education: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.social_links || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, social_links: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Contact Details
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.contact_details || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, contact_details: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Business Email
                        </label>
                        <input
                          type="email"
                          className="w-full p-2 border rounded-md"
                          value={profileData?.contact_email || ''}
                          onChange={(e) => {
                            if (profileData) {
                              const updatedData = { ...profileData, contact_email: e.target.value };
                              useProfile().setProfileData(updatedData);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">
                        Bio
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-md min-h-[100px]"
                        value={profileData?.bio || ''}
                        onChange={(e) => {
                          if (profileData) {
                            const updatedData = { ...profileData, bio: e.target.value };
                            useProfile().setProfileData(updatedData);
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <ArchitectInfo 
                  profileData={profileData} 
                  user={user}
                />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">My Designs</h2>
            <ArchitectDesigns userId={user.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyProfile;
