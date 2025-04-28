
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { DesignImageUpload } from "./DesignImageUpload";
import { FloorPlanFields } from "./FloorPlanFields";
import { InspirationFields } from "./InspirationFields";
import { DesignFormFields } from "./DesignFormFields";
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
            <DesignFormFields 
              form={form}
              designTitle={designTitle}
              setDesignTitle={setDesignTitle}
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
