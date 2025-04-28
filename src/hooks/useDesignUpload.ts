
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Schema for design upload form validation
const designFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["floorplan", "inspiration"]),
  metadata: z.object({
    rooms: z.number().optional(),
    squareFeet: z.number().optional(),
    designType: z.string().optional(),
  }).optional(),
});

type DesignFormValues = z.infer<typeof designFormSchema>;

export const useDesignUpload = () => {
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [designTitle, setDesignTitle] = useState("");
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
      category: "inspiration",
      metadata: {
        designType: "modern",
      },
    },
  });

  // Get the current category value
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

  const uploadDesignImage = async () => {
    if (!designImage || !user) return null;
    
    try {
      const fileExt = designImage.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('design_images')
        .upload(filePath, designImage);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('design_images').getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const uploadDesign = async (title: string, imageUrl: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to upload designs",
      });
      return false;
    }
    
    try {
      setUploadingDesign(true);
      
      // Get form values
      const formValues = form.getValues();
      
      // Format metadata based on category
      const metadata: any = {
        category: formValues.category
      };
      
      if (formValues.category === "floorplan") {
        metadata.rooms = formValues.metadata?.rooms || 1;
        metadata.squareFeet = formValues.metadata?.squareFeet || 1000;
      } else {
        metadata.designType = formValues.metadata?.designType || "modern";
      }
      
      const { error } = await supabase
        .from('posts')
        .insert({
          title: title,
          image_url: imageUrl,
          user_id: user.id,
          metadata: metadata
        });
        
      if (error) throw error;
      
      toast({
        title: "Design Uploaded",
        description: "Your design has been successfully uploaded",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error in design upload:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
      });
      return false;
    } finally {
      setUploadingDesign(false);
    }
  };

  const onSubmit = async (values: DesignFormValues) => {
    try {
      const imageUrl = await uploadDesignImage();
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Failed to upload the image. Please try again.",
        });
        return;
      }

      const success = await uploadDesign(values.title, imageUrl);
      if (success) {
        form.reset();
        setDesignImage(null);
        setDesignTitle("");
        navigate("/architect-profile", { replace: true });
      }
    } catch (error: any) {
      console.error("Error in onSubmit:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
      });
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
    uploadDesignImage,
    uploadDesign,
    onSubmit,
    category
  };
};
