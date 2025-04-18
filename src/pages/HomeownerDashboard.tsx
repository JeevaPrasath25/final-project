
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import HomeownerProfileForm from "@/components/profile/HomeownerProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const HomeownerDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const {
    isLoading,
    profileData,
    profileImage,
    setProfileImage,
    updateProfile
  } = useProfile();

  // Redirect if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/login" />;
  }

  // Redirect if user is an architect
  if (profileData && profileData.role === "architect") {
    return <Navigate to="/architect-profile" />;
  }

  const handleProfileUpdate = async (values: any) => {
    const success = await updateProfile(values);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  const handleFileChange = (file: File | null) => {
    setProfileImage(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        {isLoading || authLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Profile Details</h2>
                  {!isEditing && profileData && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
                {isEditing ? (
                  <HomeownerProfileForm
                    profileData={profileData}
                    onSubmit={handleProfileUpdate}
                    isLoading={isLoading}
                    onFileChange={handleFileChange}
                  />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Name</h3>
                      <p>{profileData?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Bio</h3>
                      <p>{profileData?.bio || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Contact Number</h3>
                      <p>{profileData?.contact_details || 'Not set'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Project Type</h3>
                      <p>{profileData?.project_type || 'Not set'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomeownerDashboard;

