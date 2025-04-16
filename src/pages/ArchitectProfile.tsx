
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2, Upload, Heart, Bookmark, PenSquare, User, Image as ImageIcon, Camera } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const ArchitectProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [designTitle, setDesignTitle] = useState("");
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const designImageRef = useRef<HTMLInputElement>(null);

  // Schema for profile form validation
  const profileFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    contact_number: z.string().optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  });

  // Schema for design upload form validation
  const designFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      contact_number: "",
      bio: "",
    },
  });

  const designForm = useForm<z.infer<typeof designFormSchema>>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to view your profile",
      });
      navigate("/login");
      return;
    }

    fetchProfileData();
    fetchDesigns();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      setProfileData(data);
      profileForm.reset({
        username: data.username || "",
        contact_number: data.contact_details || "",
        bio: data.bio || "",
      });

      // Get profile image if exists
      if (data.avatar_url) {
        setProfileImageUrl(data.avatar_url);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDesigns = async () => {
    try {
      const { data, error } = await supabase
        .from("designs")
        .select("*, design_likes(count), design_saves(count)")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // For each design, check if the current user has liked or saved it
      const designsWithUserActions = await Promise.all(
        data.map(async (design) => {
          const [likesResult, savesResult] = await Promise.all([
            supabase
              .from("design_likes")
              .select("*")
              .eq("design_id", design.id)
              .eq("user_id", user?.id)
              .single(),
            supabase
              .from("design_saves")
              .select("*")
              .eq("design_id", design.id)
              .eq("user_id", user?.id)
              .single(),
          ]);

          return {
            ...design,
            liked_by_user: !likesResult.error,
            saved_by_user: !savesResult.error,
          };
        })
      );

      setDesigns(designsWithUserActions);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching designs",
        description: error.message,
      });
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleDesignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDesignImage(e.target.files[0]);
      
      // Set the file name as the default title if the title is empty
      const fileName = e.target.files[0].name.split('.')[0];
      if (!designTitle) {
        setDesignTitle(fileName);
        designForm.setValue("title", fileName);
      }
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return null;

    setUploadingProfileImage(true);
    try {
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, profileImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading profile image",
        description: error.message,
      });
      return null;
    } finally {
      setUploadingProfileImage(false);
    }
  };

  const uploadDesignImage = async () => {
    if (!designImage) return null;

    setUploadingDesign(true);
    try {
      const fileExt = designImage.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, designImage);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('designs').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading design image",
        description: error.message,
      });
      return null;
    } finally {
      setUploadingDesign(false);
    }
  };

  const updateProfile = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true);
      
      // Upload profile image if selected
      let avatar_url = profileData?.avatar_url;
      if (profileImage) {
        const publicUrl = await uploadProfileImage();
        if (publicUrl) {
          avatar_url = publicUrl;
        }
      }

      const updates = {
        username: values.username,
        contact_details: values.contact_number,
        bio: values.bio,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Reset form and refresh data
      setIsEditing(false);
      fetchProfileData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDesign = async (values: z.infer<typeof designFormSchema>) => {
    try {
      // If we have a generated image, use that, otherwise upload the selected image
      let imageUrl;
      
      if (generatedImage) {
        imageUrl = generatedImage;
      } else {
        // Upload design image
        imageUrl = await uploadDesignImage();
        if (!imageUrl) return;
      }

      // Insert design into database
      const { error } = await supabase
        .from('designs')
        .insert({
          user_id: user?.id,
          title: values.title,
          image_url: imageUrl,
        });

      if (error) throw error;

      toast({
        title: "Design uploaded",
        description: "Your design has been uploaded successfully",
      });
      
      // Reset form and refresh designs
      designForm.reset();
      setDesignImage(null);
      setGeneratedImage(null);
      fetchDesigns();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error uploading design",
        description: error.message,
      });
    }
  };

  const generateDesignWithAI = async () => {
    if (!aiPrompt) {
      toast({
        variant: "destructive",
        title: "Prompt required",
        description: "Please enter a prompt for the AI to generate a design",
      });
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      
      // Set the AI prompt as the default title
      const title = aiPrompt.split(' ').slice(0, 5).join(' ') + '...';
      designForm.setValue("title", title);
      setDesignTitle(title);
      
      toast({
        title: "Image generated",
        description: "AI has generated your design successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error.message,
      });
    } finally {
      setGeneratingImage(false);
    }
  };

  const toggleLikeDesign = async (designId: string, currentlyLiked: boolean) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to like designs",
        });
        return;
      }

      if (currentlyLiked) {
        // Unlike the design
        const { error } = await supabase
          .from('design_likes')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like the design
        const { error } = await supabase
          .from('design_likes')
          .insert({
            design_id: designId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update designs state
      setDesigns(designs.map(design => {
        if (design.id === designId) {
          return {
            ...design,
            liked_by_user: !currentlyLiked,
            design_likes: {
              count: currentlyLiked 
                ? design.design_likes.count - 1 
                : design.design_likes.count + 1
            }
          };
        }
        return design;
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating like",
        description: error.message,
      });
    }
  };

  const toggleSaveDesign = async (designId: string, currentlySaved: boolean) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to save designs",
        });
        return;
      }

      if (currentlySaved) {
        // Unsave the design
        const { error } = await supabase
          .from('design_saves')
          .delete()
          .eq('design_id', designId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Save the design
        const { error } = await supabase
          .from('design_saves')
          .insert({
            design_id: designId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      // Update designs state
      setDesigns(designs.map(design => {
        if (design.id === designId) {
          return {
            ...design,
            saved_by_user: !currentlySaved,
            design_saves: {
              count: currentlySaved 
                ? design.design_saves.count - 1 
                : design.design_saves.count + 1
            }
          };
        }
        return design;
      }));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating save",
        description: error.message,
      });
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  {profileImageUrl ? (
                    <AvatarImage src={profileImageUrl} alt={profileData?.username || 'Profile'} />
                  ) : (
                    <AvatarFallback className="bg-design-primary text-white text-3xl">
                      {profileData?.username?.charAt(0).toUpperCase() || <User />}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full bg-white"
                    onClick={() => profileImageRef.current?.click()}
                    disabled={uploadingProfileImage}
                  >
                    {uploadingProfileImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <input
                      ref={profileImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                      disabled={uploadingProfileImage}
                    />
                  </Button>
                )}
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold font-playfair mb-1">
                      {profileData?.username || 'Architect'}
                    </h1>
                    <p className="text-design-primary mb-2">Architect</p>
                    {!isEditing && profileData?.bio && (
                      <p className="text-muted-foreground mt-2 max-w-2xl">{profileData.bio}</p>
                    )}
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-8">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="contact_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us about yourself..."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}

            {!isEditing && (
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
              {designs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No designs yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by uploading your first design or generate one with AI.
                  </p>
                  <Button onClick={() => document.querySelector('[data-value="upload"]')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload a Design
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designs.map((design) => (
                    <Card key={design.id} className="overflow-hidden">
                      <div className="relative pb-[66%] bg-gray-100">
                        <img
                          src={design.image_url}
                          alt={design.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate flex-grow">{design.title}</h3>
                          <div className="flex space-x-2 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className={design.liked_by_user ? "text-red-500" : "text-gray-500"}
                              onClick={() => toggleLikeDesign(design.id, design.liked_by_user)}
                            >
                              <Heart className="h-5 w-5" fill={design.liked_by_user ? "currentColor" : "none"} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className={design.saved_by_user ? "text-yellow-500" : "text-gray-500"}
                              onClick={() => toggleSaveDesign(design.id, design.saved_by_user)}
                            >
                              <Bookmark className="h-5 w-5" fill={design.saved_by_user ? "currentColor" : "none"} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex space-x-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center">
                            <Heart className="h-4 w-4 mr-1" /> {design.design_likes?.count || 0}
                          </span>
                          <span className="flex items-center">
                            <Bookmark className="h-4 w-4 mr-1" /> {design.design_saves?.count || 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 font-playfair">Upload New Design</h2>
                    <p className="text-muted-foreground">
                      Share your architectural designs with the community or generate a design with AI.
                    </p>
                  </div>

                  <Form {...designForm}>
                    <form onSubmit={designForm.handleSubmit(uploadDesign)} className="space-y-6">
                      <FormField
                        control={designForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Design Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Enter a title for your design" 
                                value={designTitle}
                                onChange={(e) => {
                                  setDesignTitle(e.target.value);
                                  field.onChange(e);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {generatedImage ? (
                        <div className="mt-4">
                          <Label className="block mb-2">Generated Design</Label>
                          <div className="relative pb-[66%] bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={generatedImage}
                              alt="AI Generated Design"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => setGeneratedImage(null)}
                          >
                            Remove Generated Image
                          </Button>
                        </div>
                      ) : designImage ? (
                        <div className="mt-4">
                          <Label className="block mb-2">Selected Design</Label>
                          <div className="relative pb-[66%] bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={URL.createObjectURL(designImage)}
                              alt="Selected Design"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => {
                              setDesignImage(null);
                              if (designImageRef.current) {
                                designImageRef.current.value = '';
                              }
                            }}
                          >
                            Remove Selected Image
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label className="block mb-2">Upload Design</Label>
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-design-primary transition-colors"
                              onClick={() => designImageRef.current?.click()}
                            >
                              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-1">Click to upload</p>
                              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 10MB)</p>
                              <input
                                ref={designImageRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleDesignImageChange}
                              />
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <div>
                                <Label className="block mb-2">Generate with AI</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-design-primary transition-colors">
                                  <PenSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mb-1">Generate with AI</p>
                                  <p className="text-xs text-muted-foreground">Create a design using AI</p>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Generate Design with AI</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="ai-prompt">Describe the design</Label>
                                  <Textarea 
                                    id="ai-prompt"
                                    placeholder="Modern minimalist house with large windows and a flat roof..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </div>
                                {generatingImage && (
                                  <div className="text-center p-4">
                                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-design-primary mb-2" />
                                    <p className="text-sm text-muted-foreground">Generating your design...</p>
                                  </div>
                                )}
                                {generatedImage && (
                                  <div className="relative pb-[66%] bg-gray-100 rounded-md overflow-hidden">
                                    <img
                                      src={generatedImage}
                                      alt="AI Generated Design"
                                      className="absolute inset-0 w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button 
                                  type="button" 
                                  onClick={generateDesignWithAI}
                                  disabled={!aiPrompt || generatingImage}
                                >
                                  {generatingImage ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>Generate</>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          disabled={
                            (!designImage && !generatedImage) || 
                            uploadingDesign || 
                            !designTitle
                          }
                          className="w-full"
                        >
                          {uploadingDesign ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>Upload Design</>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchitectProfilePage;
