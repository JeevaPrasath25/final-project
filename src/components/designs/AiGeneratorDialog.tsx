
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const handleGenerateImage = async () => {
    try {
      const imageUrl = await generateDesignWithAI();
      if (imageUrl) {
        onImageGenerated(imageUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error in handleGenerateImage:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Design with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          {generatingImage && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 mx-auto animate-spin text-design-primary mb-2" />
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
            disabled={!aiPrompt || generatingImage}
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
