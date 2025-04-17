
import React from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, MapPin, Award, Calendar, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import DesignGrid from "@/components/designs/DesignGrid";
import DesignUploadForm from "@/components/designs/DesignUploadForm";
import AiGeneratorDialog from "@/components/designs/AiGeneratorDialog";
import { useProfile } from "@/hooks/useProfile";
import { useDesigns } from "@/hooks/useDesigns";
import { useAiGenerator } from "@/hooks/useAiGenerator";

const ArchitectProfilePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("designs");
  
  const {
    isLoading,
    profileData,
    profileImageUrl,
    uploadingProfileImage,
    setProfileImage,
    updateProfile
  } = useProfile();
  
  const {
    designs,
    designImage,
    uploadingDesign,
    setDesignImage,
    uploadDesign,
    uploadDesignImage,
    toggleLikeDesign,
    toggleSaveDesign
  } = useDesigns();
  
  const {
    aiPrompt,
    setAiPrompt,
    generatingImage,
    generatedImage,
    setGeneratedImage,
    generateDesignWithAI
  } = useAiGenerator();

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
    const success = await updateProfile(values);
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleAiImageGenerated = (imageUrl: string | null) => {
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      // Switch to upload tab automatically
      setActiveTab("upload");
    }
  };
  
  const handleDesignUploadClick = () => {
    setActiveTab("upload");
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
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  {profileData?.contact_details && (
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Number</p>
                      <p className="font-medium">{profileData.contact_details}</p>
                    </div>
                  )}
                </div>

                {/* Additional architect details */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData?.experience && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Experience</p>
                          <p className="font-medium">{profileData.experience}</p>
                        </div>
                      </div>
                    )}
                    {profileData?.skills && (
                      <div className="flex items-start gap-2">
                        <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Specialization</p>
                          <p className="font-medium">{profileData.skills}</p>
                        </div>
                      </div>
                    )}
                    {profileData?.education && (
                      <div className="flex items-start gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Education</p>
                          <p className="font-medium">{profileData.education}</p>
                        </div>
                      </div>
                    )}
                    {profileData?.social_links && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Location</p>
                          <p className="font-medium">{profileData.social_links}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {profileData?.contact_email && (
                    <div className="mt-4 flex items-start gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Email</p>
                        <p className="font-medium">{profileData.contact_email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="designs">My Designs</TabsTrigger>
              <TabsTrigger value="upload">Upload New Design</TabsTrigger>
            </TabsList>
            
            <TabsContent value="designs" className="space-y-6">
              <DesignGrid
                designs={designs}
                onLike={toggleLikeDesign}
                onSave={toggleSaveDesign}
                onUploadClick={handleDesignUploadClick}
              />
            </TabsContent>
            
            <TabsContent value="upload">
              <DesignUploadForm
                designImage={designImage}
                uploadingDesign={uploadingDesign}
                generatedImage={generatedImage}
                setDesignImage={setDesignImage}
                uploadDesign={uploadDesign}
                uploadDesignImage={uploadDesignImage}
                setGeneratedImage={setGeneratedImage}
                onAiGeneratorClick={() => setIsAiDialogOpen(true)}
              />
            </TabsContent>
          </Tabs>
          
          <AiGeneratorDialog
            isOpen={isAiDialogOpen}
            onClose={() => setIsAiDialogOpen(false)}
            aiPrompt={aiPrompt}
            setAiPrompt={setAiPrompt}
            generatingImage={generatingImage}
            generatedImage={generatedImage}
            generateDesignWithAI={generateDesignWithAI}
            onImageGenerated={handleAiImageGenerated}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchitectProfilePage;
