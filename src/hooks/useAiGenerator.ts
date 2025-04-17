
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
      console.log("Sending request to generate image with prompt:", aiPrompt);
      
      const response = await fetch('https://olwapbbjgyahmtpgbrgt.supabase.co/functions/v1/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (!data.image) {
        throw new Error('No image returned from API');
      }
      
      console.log("Image generated successfully");
      setGeneratedImage(data.image);
      
      toast({
        title: "Image generated",
        description: "AI has generated your design successfully",
      });
      
      return data.image;
    } catch (error: any) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: error.message || "Unknown error occurred",
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
