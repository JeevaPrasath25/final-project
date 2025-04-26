
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDesigns } from "@/hooks/useDesigns";
import { useAiGenerator } from "@/hooks/useAiGenerator";

// Form schema validation
const uploadFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["floorplan", "inspiration"]),
  // Conditional fields
  rooms: z.number().min(1).max(20).optional(),
  squareFeet: z.number().min(100).max(20000).optional(),
  designType: z.string().optional(),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

const ArchitectUploadForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDesign, uploadDesignImage } = useDesigns();
  const { generatedImage, setGeneratedImage } = useAiGenerator();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      title: "",
      category: "inspiration",
    },
  });

  const category = form.watch("category");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDesignImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratedImageUse = () => {
    if (generatedImage) {
      setImagePreview(generatedImage);
      // We'll handle the base64 image during submit
    }
  };
  
  const onSubmit = async (data: UploadFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload designs",
        variant: "destructive",
      });
      return;
    }

    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please select or generate an image to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl: string;
      
      // If using a generated image (base64)
      if (generatedImage && imagePreview === generatedImage) {
        // Convert base64 to file
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "generated-design.png", { type: "image/png" });
        setDesignImage(file);
        
        // Upload the file
        const uploadedImageUrl = await uploadDesignImage();
        if (!uploadedImageUrl) {
          throw new Error("Failed to upload generated image");
        }
        imageUrl = uploadedImageUrl;
      } else if (designImage) {
        // Upload regular file
        const uploadedImageUrl = await uploadDesignImage();
        if (!uploadedImageUrl) {
          throw new Error("Failed to upload image");
        }
        imageUrl = uploadedImageUrl;
      } else {
        throw new Error("No image to upload");
      }
      
      // Prepare metadata based on category
      const metadata: any = {};
      if (data.category === "floorplan") {
        metadata.rooms = data.rooms;
        metadata.squareFeet = data.squareFeet;
      } else {
        metadata.designType = data.designType;
      }

      // Upload design details to database
      const success = await uploadDesign(data.title, imageUrl, data.category, metadata);
      
      if (success) {
        toast({
          title: "Design uploaded successfully",
          description: "Your design has been added to the platform",
        });
        form.reset();
        setDesignImage(null);
        setImagePreview(null);
        setGeneratedImage(null);
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your design",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="floorplan">Floor Plan</SelectItem>
                      <SelectItem value="inspiration">Design Inspiration</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional fields based on category */}
            {category === "floorplan" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Rooms</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="squareFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Feet</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : "")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {category === "inspiration" && (
              <FormField
                control={form.control}
                name="designType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a design type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="traditional">Traditional</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="scandinavian">Scandinavian</SelectItem>
                        <SelectItem value="farmhouse">Farmhouse</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <Label>Design Image</Label>
              
              <div className="flex flex-col space-y-4">
                <div className="grid gap-4">
                  <div 
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${designImage || generatedImage ? 'border-green-300' : 'border-gray-300'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Design preview" 
                          className="mx-auto max-h-64 rounded-md" 
                        />
                        <div className="mt-2">Click to change image</div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                
                {generatedImage && !imagePreview && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGeneratedImageUse}
                  >
                    Use AI Generated Image
                  </Button>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Uploading...
                </>
              ) : (
                <>Upload Design</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ArchitectUploadForm;
