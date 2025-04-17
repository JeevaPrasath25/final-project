
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import DesignGrid from "@/components/designs/DesignGrid";
import { Design, useDesigns } from "@/hooks/useDesigns";

const HomeownerDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const {
    isLoading,
    profileData,
    profileImage,
    setProfileImage,
    updateProfile
  } = useProfile();

  const { 
    toggleLikeDesign, 
    toggleSaveDesign 
  } = useDesigns();

  const [activeTab, setActiveTab] = useState("profile");
  const [savedDesigns, setSavedDesigns] = useState<Design[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

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

  // Fetch saved designs when tab changes to "saved"
  useEffect(() => {
    const fetchSavedDesigns = async () => {
      if (activeTab !== "saved" || !user) return;
      
      setLoadingSaved(true);
      try {
        // Get all designs saved by this user
        const { data: savedData, error: savedError } = await supabase
          .from("design_saves")
          .select("design_id")
          .eq("user_id", user.id);
        
        if (savedError) throw savedError;
        
        if (savedData && savedData.length > 0) {
          const designIds = savedData.map(item => item.design_id);
          
          // Fetch the actual designs
          const { data: designsData, error: designsError } = await supabase
            .from("designs")
            .select(`
              *,
              users (
                username, 
                avatar_url
              )
            `)
            .in("id", designIds);
          
          if (designsError) throw designsError;
          
          if (designsData && designsData.length > 0) {
            // Process each design to include like/save status
            const processedDesigns = await Promise.all(
              designsData.map(async (design) => {
                // Check if user has liked the design
                const { data: likeData } = await supabase
                  .from("design_likes")
                  .select("*")
                  .eq("design_id", design.id)
                  .eq("user_id", user.id)
                  .maybeSingle();

                // Count likes for the design
                const { count: likesCount } = await supabase
                  .from("design_likes")
                  .select("*", { count: "exact", head: true })
                  .eq("design_id", design.id);

                // Count saves for the design
                const { count: savesCount } = await supabase
                  .from("design_saves")
                  .select("*", { count: "exact", head: true })
                  .eq("design_id", design.id);

                return {
                  ...design,
                  liked_by_user: !!likeData,
                  saved_by_user: true, // Since these are all saved designs
                  design_likes: { count: likesCount || 0 },
                  design_saves: { count: savesCount || 0 }
                } as Design;
              })
            );
            
            setSavedDesigns(processedDesigns);
          } else {
            setSavedDesigns([]);
          }
        } else {
          setSavedDesigns([]);
        }
      } catch (error) {
        console.error("Error fetching saved designs:", error);
      } finally {
        setLoadingSaved(false);
      }
    };

    fetchSavedDesigns();
  }, [activeTab, user]);

  const handleLikeDesign = async (id: string, liked: boolean) => {
    await toggleLikeDesign(id, liked);
    
    // Update the state locally for immediate UI feedback
    setSavedDesigns(designs => 
      designs.map(design => {
        if (design.id === id) {
          return {
            ...design,
            liked_by_user: !liked,
            design_likes: {
              count: liked 
                ? design.design_likes.count - 1 
                : design.design_likes.count + 1
            }
          };
        }
        return design;
      })
    );
  };

  const handleSaveDesign = async (id: string, saved: boolean) => {
    await toggleSaveDesign(id, saved);
    
    // If user unsaves a design, remove it from the list
    if (saved) {
      setSavedDesigns(designs => designs.filter(design => design.id !== id));
    }
  };

  const handleBrowseClick = () => {
    window.location.href = "/explore";
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
                  {loadingSaved ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                  ) : savedDesigns.length > 0 ? (
                    <DesignGrid 
                      designs={savedDesigns} 
                      onLike={handleLikeDesign}
                      onSave={handleSaveDesign}
                      onUploadClick={handleBrowseClick}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No saved designs yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start browsing and save designs you like
                      </p>
                      <Button onClick={handleBrowseClick}>
                        Browse Designs
                      </Button>
                    </div>
                  )}
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
