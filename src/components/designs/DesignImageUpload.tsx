
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DesignImageUploadProps {
  designImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const DesignImageUpload = ({
  designImage,
  onImageChange,
  onRemoveImage,
  inputRef,
}: DesignImageUploadProps) => {
  return (
    <div className="mt-4">
      <Label className="block mb-2">Upload Design</Label>
      {designImage ? (
        <div className="relative pb-[66%] bg-gray-100 rounded-md overflow-hidden">
          <img
            src={URL.createObjectURL(designImage)}
            alt="Selected Design"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <Button 
            type="button" 
            variant="outline" 
            className="mt-2"
            onClick={onRemoveImage}
          >
            Remove Selected Image
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:border-design-primary transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">Click to upload</p>
          <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 10MB)</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
      )}
    </div>
  );
};
