
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface AiGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  generatingImage: boolean;
  generatedImage: string | null;
  generateDesignWithAI: () => Promise<string | null>;
  onImageGenerated: (image: string | null) => void;
}

const AiGeneratorDialog = ({
  isOpen,
  onClose,
  aiPrompt,
  setAiPrompt,
  generatingImage,
  generatedImage,
  generateDesignWithAI,
  onImageGenerated
}: AiGeneratorDialogProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!aiPrompt.trim()) {
      setError("Please enter a description for your design.");
      return;
    }
    
    setError(null);
    try {
      const imageUrl = await generateDesignWithAI();
      if (imageUrl) {
        onImageGenerated(imageUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error in handleGenerateImage:", error);
      setError("Failed to generate image. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Design with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertDescription>
              Our AI system is currently showing sample images. Full AI generation will be available soon.
            </AlertDescription>
          </Alert>
          
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
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}
          
          {generatingImage && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-2" />
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
            onClick={handleGenerateImage}
            disabled={!aiPrompt.trim() || generatingImage}
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
  );
};

export default AiGeneratorDialog;
