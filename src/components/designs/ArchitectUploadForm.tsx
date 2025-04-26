
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { DesignImageUpload } from "./DesignImageUpload";
import { FloorPlanFields } from "./FloorPlanFields";
import { InspirationFields } from "./InspirationFields";
import { useDesignUpload } from "@/hooks/useDesignUpload";

const ArchitectUploadForm = () => {
  const designImageRef = useRef<HTMLInputElement>(null);
  const {
    form,
    designImage,
    designTitle,
    setDesignTitle,
    setDesignImage,
    uploadingDesign,
    handleDesignImageChange,
    onSubmit,
    category,
  } = useDesignUpload();

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

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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

            {category === "floorplan" ? (
              <FloorPlanFields form={form} />
            ) : (
              <InspirationFields form={form} />
            )}

            <DesignImageUpload
              designImage={designImage}
              onImageChange={handleDesignImageChange}
              onRemoveImage={() => {
                setDesignImage(null);
                if (designImageRef.current) {
                  designImageRef.current.value = '';
                }
              }}
              inputRef={designImageRef}
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={!designImage || uploadingDesign || !designTitle}
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

export default ArchitectUploadForm;
