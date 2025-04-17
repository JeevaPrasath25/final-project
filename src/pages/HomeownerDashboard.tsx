
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

  const [activeTab, setActiveTab] = useState("profile");

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
          subtitle="Manage your profile and saved designs"
          centered
        />

        {isLoading || authLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto mt-8"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">My Profile</TabsTrigger>
              <TabsTrigger value="saved">Saved Designs</TabsTrigger>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
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
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No saved designs yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start browsing and save designs you like
                    </p>
                    <Button asChild>
                      <a href="/explore">Browse Designs</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consultations">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No active consultations</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect with an architect to start a consultation
                    </p>
                    <Button asChild>
                      <a href="/architects">Find Architects</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default HomeownerDashboard;
