
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useDesigns } from "@/hooks/useDesigns";
import { DesignCategory, DesignType, DESIGN_TYPES } from "@/types/design";

// Create a Zod schema that properly handles the discriminated union
const designFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["floorplan", "inspiration"] as const),
  metadata: z.discriminatedUnion("category", [
    z.object({
      category: z.literal("floorplan"),
      rooms: z.number().int().min(1).max(20),
      squareFeet: z.number().int().min(100).max(20000),
    }),
    z.object({
      category: z.literal("inspiration"),
      designType: z.enum(DESIGN_TYPES as [DesignType, ...DesignType[]]),
    }),
  ]),
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

  // Initialize the form with the correct defaults for both metadata types
  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
      category: "inspiration",
      metadata: {
        category: "inspiration",
        designType: "modern",
      },
    },
  });

  // When the category changes, update the metadata structure
  const category = form.watch("category");
  if (category === "floorplan" && form.getValues("metadata.category") !== "floorplan") {
    form.setValue("metadata", {
      category: "floorplan",
      rooms: 1,
      squareFeet: 1000,
    });
  } else if (category === "inspiration" && form.getValues("metadata.category") !== "inspiration") {
    form.setValue("metadata", {
      category: "inspiration",
      designType: "modern",
    });
  }

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

      const success = await uploadDesign(values.title, imageUrl);

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
    category,
  };
};
