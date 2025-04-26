
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useDesigns } from "@/hooks/useDesigns";

const designFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["floorplan", "inspiration"]),
  rooms: z.number().min(1).max(20).optional(),
  squareFeet: z.number().min(100).max(20000).optional(),
  designType: z.string().optional(),
});

type DesignFormValues = z.infer<typeof designFormSchema>;

export const useDesignUpload = () => {
  const [designTitle, setDesignTitle] = useState("");
  const { toast } = useToast();
  const {
    designImage,
    setDesignImage,
    uploadingDesign,
    uploadDesign,
    uploadDesignImage,
  } = useDesigns();

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
      category: "inspiration",
    },
  });

  const handleDesignImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Maximum file size is 10MB",
        });
        return;
      }
      
      setDesignImage(file);
      
      const fileName = file.name.split('.')[0];
      if (!designTitle) {
        setDesignTitle(fileName);
        form.setValue("title", fileName);
      }
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

      const success = await uploadDesign(values.title, imageUrl, values.category, {
        rooms: values.rooms,
        squareFeet: values.squareFeet,
        designType: values.designType,
      });

      if (success) {
        form.reset();
        setDesignImage(null);
        setDesignTitle("");
      }
    } catch (error: any) {
      console.error("Error in design upload:", error);
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
    onSubmit,
  };
};
