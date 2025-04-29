
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Fallback images to use when API calls fail
const fallbackImages = {
  house: [
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
  ],
  floorplan: [
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80",
    "https://images.unsplash.com/photo-1604709178681-82325c04f8bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    "https://images.unsplash.com/photo-1595409290339-8c0a57a9d707?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80",
    "https://images.unsplash.com/photo-1608444165273-d83d50109f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
  ]
};

export function useAiGenerator() {
  const [aiPrompt, setAiPrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(true);  // Default to fallback mode for now

  const generateDesignWithAI = async (type: "house" | "floorplan" = "house") => {
    setGeneratingImage(true);
    
    try {
      // Log the request
      console.info(`Sending request to generate ${type} with prompt: ${aiPrompt}`);
      
      // Try to use the Edge Function if fallback mode is disabled
      if (!useFallback) {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt: aiPrompt, type }
        });
        
        console.info(`Response from generate-image function:`, { data, error });
        
        if (error) {
          console.error("Supabase function error:", error);
          throw error;
        }
        
        if (data?.imageUrl) {
          setGeneratedImage(data.imageUrl);
          return data.imageUrl;
        }
        
        throw new Error("No image URL returned");
      } else {
        // Use fallback images in fallback mode
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
        const images = type === "house" ? fallbackImages.house : fallbackImages.floorplan;
        const randomIndex = Math.floor(Math.random() * images.length);
        const fallbackImage = images[randomIndex];
        
        // Display fallback notification with the updated message
        toast({
          description: "Using sample image - Our AI is currently being trained and this feature will be available soon",
        });
        
        setGeneratedImage(fallbackImage);
        return fallbackImage;
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      
      // Fallback to sample images if API call fails
      const images = type === "house" ? fallbackImages.house : fallbackImages.floorplan;
      const randomIndex = Math.floor(Math.random() * images.length);
      const fallbackImage = images[randomIndex];
      
      // Updated notification message
      toast({
        description: "Using sample image - Our AI is currently being trained and this feature will be available soon",
      });
      
      setGeneratedImage(fallbackImage);
      return fallbackImage;
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
    useFallback,
    setUseFallback
  };
}
