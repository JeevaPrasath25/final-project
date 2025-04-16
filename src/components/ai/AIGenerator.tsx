
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCcw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const samplePrompts = [
  "A modern Mediterranean villa with a pool and ocean view",
  "A cozy mountain cabin with large windows and a stone fireplace",
  "A minimalist Japanese-inspired home with an interior garden"
];

const AIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of your dream home.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: JSON.stringify({ prompt })
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImages([data.image]);
        toast({
          title: "Design generated",
          description: "Your dream home design has been created.",
        });
      } else if (data?.error) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ''));
      }
    } catch (error: any) {
      console.error('Error details:', error);
      
      const errorMessage = error.message || "Unable to generate image. Please try again.";
      setError(errorMessage);
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSamplePrompt = (sample: string) => {
    setPrompt(sample);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-playfair mb-4">AI Dream Home Generator</h1>
          <p className="text-muted-foreground text-lg">
            Describe your dream home in detail and our AI will generate visual concepts to inspire your journey.
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Describe your dream home
            </label>
            <Textarea
              id="prompt"
              placeholder="E.g., A two-story modern farmhouse with large windows, wood accents, and an open floor plan..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <p className="text-sm font-medium w-full mb-1">Try these examples:</p>
            {samplePrompts.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSamplePrompt(sample)}
                className="text-xs"
              >
                {sample}
              </Button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(prompt)}>
              Copy
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </div>
        </Card>

        {generatedImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 font-playfair">Your Generated Designs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Generated design ${index + 1}`} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white hover:bg-white/20"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image;
                        link.download = `design_${index + 1}.png`;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
