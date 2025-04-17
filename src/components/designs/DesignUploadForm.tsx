
import { useRef, useState } from "react";
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

// Schema for design upload form validation
const designFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
});

type DesignFormValues = z.infer<typeof designFormSchema>;

interface DesignUploadFormProps {
  designImage: File | null;
  uploadingDesign: boolean;
  setDesignImage: (file: File | null) => void;
  uploadDesign: (title: string, imageUrl: string) => Promise<boolean>;
  uploadDesignImage: () => Promise<string | null>;
}

const DesignUploadForm = ({
  designImage,
  uploadingDesign,
  setDesignImage,
  uploadDesign,
  uploadDesignImage,
}: DesignUploadFormProps) => {
  const [designTitle, setDesignTitle] = useState("");
  const designImageRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      title: "",
    },
  });

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

  const onSubmit = async (values: DesignFormValues) => {
    try {
      // Upload design image
      const imageUrl = await uploadDesignImage();
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Failed to upload the image. Please try again.",
        });
        return;
      }

      // Upload design
      const success = await uploadDesign(values.title, imageUrl);
      if (success) {
        form.reset();
        setDesignImage(null);
        setDesignTitle("");
        if (designImageRef.current) {
          designImageRef.current.value = '';
        }
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 font-playfair">Upload New Design</h2>
          <p className="text-muted-foreground">
            Share your architectural designs with the community.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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

            {designImage ? (
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
              <div className="mt-4">
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
            )}

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={
                  !designImage || 
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
  );
};

export default DesignUploadForm;
