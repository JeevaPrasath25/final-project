
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAiGenerator = () => {
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateDesignWithAI = async (type: "house" | "floorplan" = "house") => {
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
      console.log(`Sending request to generate ${type} with prompt:`, aiPrompt);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt: aiPrompt,
          type: type 
        }
      });

      console.log('Response from generate-image function:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (!data?.image) {
        throw new Error('No image URL returned from API');
      }
      
      setGeneratedImage(data.image);
      
      toast({
        title: type === "house" ? "Design generated" : "Floor plan generated",
        description: type === "house" 
          ? "AI has generated your design successfully" 
          : "AI has generated your floor plan successfully",
      });
      
      return data.image;
    } catch (error: any) {
      console.error(`Error generating ${type}:`, error);
      toast({
        variant: "destructive",
        title: `Error generating ${type}`,
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
