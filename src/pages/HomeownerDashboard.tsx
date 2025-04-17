
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { useProfile } from "@/hooks/useProfile";
import HomeownerProfileForm from "@/components/profile/HomeownerProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const HomeownerDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
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
    return await updateProfile(values);
  };

  const handleFileChange = (file: File | null) => {
    setProfileImage(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto py-8">
        <SectionHeading 
          title="Homeowner Dashboard"
          subtitle="Manage your profile"
          centered
        />

        {isLoading || authLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mt-8">
            <Card>
              <CardContent className="pt-6">
                <HomeownerProfileForm
                  profileData={profileData}
                  onSubmit={handleProfileUpdate}
                  isLoading={isLoading}
                  onFileChange={handleFileChange}
                />
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
