import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ArchitectInfo from "@/components/architect/ArchitectInfo";
import ArchitectDesigns from "@/components/architect/ArchitectDesigns";
import { useToast } from "@/hooks/use-toast";
import { useDesigns } from "@/hooks/useDesigns";
import { useDesignUpload } from "@/hooks/useDesignUpload";

const ArchitectProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  
  const { designs, toggleLikeDesign, toggleSaveDesign, deleteDesign, updateDesign } = useDesigns(user?.id);
  const { 
    designImage, 
    setDesignImage, 
    uploadingDesign, 
    uploadDesign, 
    uploadDesignImage 
  } = useDesignUpload();

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    contact_details: "",
    education: "",
    experience: "",
    skills: "",
    social_links: "",
    contact_email: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfileData(data);
          setFormData({
            username: data.username || "",
            bio: data.bio || "",
            contact_details: data.contact_details || "",
            education: data.education || "",
            experience: data.experience || "",
            skills: data.skills || "",
            social_links: data.social_links || "",
            contact_email: data.contact_email || ""
          });

          if (data.avatar_url) {
            setProfileImagePreview(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      let avatarUrl = profileData?.avatar_url;

      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(filePath, profileImage);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("users")
        .update({
          ...formData,
          avatar_url: avatarUrl
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfileData({
        ...profileData,
        ...formData,
        avatar_url: avatarUrl
      });

      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-design-soft-purple to-design-soft-blue h-32 md:h-48"></div>
            <div className="px-4 sm:px-6 md:px-8 pb-6 -mt-16 flex flex-wrap md:flex-nowrap">
              <div className="w-full md:w-auto flex flex-col items-center md:items-start">
                <Avatar className="border-4 border-white h-32 w-32 bg-white">
                  {profileImagePreview ? (
                    <AvatarImage src={profileImagePreview} alt={formData.username} />
                  ) : (
                    <AvatarFallback className="text-4xl bg-design-primary/10 text-design-primary">
                      {formData.username ? formData.username.charAt(0).toUpperCase() : "A"}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <div className="mt-4 w-full">
                    <Label htmlFor="profile-image" className="block text-sm font-medium mb-1">
                      Profile Image
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="w-full md:pl-8 pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {isEditing ? (
                      <div className="mb-4">
                        <Label htmlFor="username" className="block text-sm font-medium mb-1">
                          Name
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className="max-w-md"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-bold">{formData.username}</h1>
                    )}

                    {isEditing ? (
                      <div className="mb-4">
                        <Label htmlFor="bio" className="block text-sm font-medium mb-1">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself"
                          className="max-w-md h-24"
                        />
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2">{formData.bio || "No bio provided"}</p>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSaving}>
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="contact_details" className="block text-sm font-medium mb-1">
                        Contact Number
                      </Label>
                      <Input
                        id="contact_details"
                        name="contact_details"
                        value={formData.contact_details}
                        onChange={handleInputChange}
                        placeholder="Your contact number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email" className="block text-sm font-medium mb-1">
                        Business Email
                      </Label>
                      <Input
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleInputChange}
                        placeholder="Your business email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="education" className="block text-sm font-medium mb-1">
                        Education
                      </Label>
                      <Input
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        placeholder="Your educational background"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience" className="block text-sm font-medium mb-1">
                        Experience
                      </Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="Your professional experience"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills" className="block text-sm font-medium mb-1">
                        Specialization
                      </Label>
                      <Input
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="Your skills and specializations"
                      />
                    </div>
                    <div>
                      <Label htmlFor="social_links" className="block text-sm font-medium mb-1">
                        Location
                      </Label>
                      <Input
                        id="social_links"
                        name="social_links"
                        value={formData.social_links}
                        onChange={handleInputChange}
                        placeholder="Your location"
                      />
                    </div>
                  </div>
                ) : (
                  <ArchitectInfo profileData={profileData} user={user} />
                )}
              </div>
            </div>
          </Card>

          <Tabs defaultValue="designs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="designs">My Designs</TabsTrigger>
              <TabsTrigger value="stats">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="designs">
              <CardContent className="p-0">
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
                  updateDesign={updateDesign}
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Design Analytics</h3>
                  <p className="text-muted-foreground">
                    Analytics features will be available soon. Track views, likes, and interactions with your designs.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ArchitectProfile;
