
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useStorage } from "@/hooks/useStorage";
import { supabase } from "@/integrations/supabase/client";

// Form schema for design upload
const designFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["floorplan", "inspiration"]),
  metadata: z.object({
    rooms: z.number().optional(),
    squareFeet: z.number().optional(),
    designType: z.string().optional(),
  }).optional(),
});

type DesignFormData = z.infer<typeof designFormSchema>;

export const useDesignUpload = () => {
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [designTitle, setDesignTitle] = useState("");
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadImage } = useStorage();

  // Initialize the form with default values
  const form = useForm<DesignFormData>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
      category: "inspiration",
      metadata: {
        rooms: 1,
        squareFeet: 1000,
        designType: "modern",
      },
    },
  });

  const category = form.watch("category");

  const handleDesignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 10MB",
        });
        return;
      }
      
      setDesignImage(file);
      
      // Set the file name as the default title if the title is empty
      const fileName = file.name.split('.')[0];
      if (!designTitle) {
        setDesignTitle(fileName);
        form.setValue("title", fileName);
      }
    }
  };

  const uploadDesignImage = async (): Promise<string | null> => {
    if (!designImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload",
      });
      return null;
    }

    try {
      return await uploadImage(designImage);
    } catch (error) {
      console.error("Error uploading design image:", error);
      return null;
    }
  };

  const uploadDesign = async (title: string, imageUrl: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to upload designs",
      });
      return false;
    }

    try {
      const formData = form.getValues();
      
      // Create the post in the database
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          image_url: imageUrl,
          user_id: user.id,
          metadata: formData.metadata,
          design_type: formData.category === "inspiration" ? formData.metadata?.designType : undefined,
        });

      if (error) {
        console.error("Error creating design:", error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Failed to create the design. Please try again.",
        });
        return false;
      }

      toast({
        title: "Design uploaded successfully",
        description: "Your design has been shared with the community.",
      });
      
      return true;
    } catch (error) {
      console.error("Error in uploadDesign:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
      });
      return false;
    }
  };

  const onSubmit = async (data: DesignFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to upload designs",
      });
      return;
    }

    if (!designImage) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to upload",
      });
      return;
    }

    try {
      setUploadingDesign(true);
      
      // Upload the image
      const imageUrl = await uploadDesignImage();
      if (!imageUrl) return;
      
      // Upload the design
      await uploadDesign(data.title, imageUrl);
      
      // Reset form after successful upload
      form.reset();
      setDesignImage(null);
      setDesignTitle("");
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setUploadingDesign(false);
    }
  };

  return {
    form,
    designImage,
    designTitle,
    setDesignTitle,
    setDesignImage,
    uploadingDesign,
    handleDesignImageChange,
    uploadDesign,
    uploadDesignImage,
    onSubmit,
    category,
  };
};
