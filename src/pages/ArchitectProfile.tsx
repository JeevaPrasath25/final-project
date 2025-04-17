import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  
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

  if (!user) {
    toast({
      variant: "destructive",
      title: "Authentication required",
      description: "You need to be logged in to view your profile",
    });
    navigate("/login");
    return null;
  }
  
  const handleProfileFormSubmit = async (values: any) => {
    const success = await updateProfile(values);
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleAiImageGenerated = (imageUrl: string | null) => {
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      
      const title = aiPrompt.split(' ').slice(0, 5).join(' ') + '...';
    }
  };

  if (isLoading && !profileData) {
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
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            )}
          </div>

          <Tabs defaultValue="designs" className="space-y-6">
            <TabsList className="mb-4">
              <TabsTrigger value="designs">My Designs</TabsTrigger>
              <TabsTrigger value="upload">Upload New Design</TabsTrigger>
            </TabsList>
            
            <TabsContent value="designs" className="space-y-6">
              <DesignGrid
                designs={designs}
                onLike={toggleLikeDesign}
                onSave={toggleSaveDesign}
                onUploadClick={() => {
                  const uploadTab = document.querySelector('[data-value="upload"]') as HTMLElement;
                  uploadTab?.click();
                }}
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
