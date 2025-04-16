
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useAiGenerator = () => {
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateDesignWithAI = async () => {
    if (!aiPrompt) {
      toast({
        variant: "destructive",
        title: "Prompt required",
        description: "Please enter a prompt for the AI to generate a design",
      });
      return null;
    }

    setGeneratingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      setGeneratedImage(data.image);
      
      toast({
        title: "Image generated",
        description: "AI has generated your design successfully",
      });
      
      return data.image;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error.message,
      });
      return null;
    } finally {
      setGeneratingImage(false);
    }
  };

  return {
    aiPrompt,
    setAiPrompt,
    generatingImage,
    generatedImage,
    setGeneratedImage,
    generateDesignWithAI,
  };
};
