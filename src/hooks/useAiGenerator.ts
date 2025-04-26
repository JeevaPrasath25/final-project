
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
      
      const finalPrompt = type === "floorplan" 
        ? `Detailed architectural floor plan showing ${aiPrompt}. Top-down view, clean lines, measurements, room labels.`
        : aiPrompt;
        
      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session ? { Authorization: `Bearer ${session.access_token}` } : {};
      
      const response = await fetch('https://olwapbbjgyahmtpgbrgt.supabase.co/functions/v1/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          type: type 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Failed to generate image');
      }

      const data = await response.json();
      
      if (!data.image) {
        throw new Error('No image returned from API');
      }
      
      console.log(`${type} generated successfully`);
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
