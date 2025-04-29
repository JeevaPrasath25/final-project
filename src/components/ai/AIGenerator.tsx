
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCcw, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAiGenerator } from "@/hooks/useAiGenerator";

const samplePrompts = [
  "A modern Mediterranean villa with a pool and ocean view",
  "A cozy mountain cabin with large windows and a stone fireplace",
  "A minimalist Japanese-inspired home with an interior garden"
];

const AIGenerator = () => {
  const { 
    aiPrompt, 
    setAiPrompt, 
    generatingImage, 
    generatedImage, 
    setGeneratedImage, 
    generateDesignWithAI,
    useFallback,
    setUseFallback
  } = useAiGenerator();
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSamplePrompt = (sample: string) => {
    setAiPrompt(sample);
  };

  const handleGenerate = async () => {
    if (!aiPrompt) {
      toast({
        variant: "destructive",
        title: "Prompt required",
        description: "Please enter a prompt for the AI to generate a design",
      });
      return;
    }

    setError(null);
    try {
      await generateDesignWithAI("house");
    } catch (error) {
      setError("Failed to generate image. Please try again.");
      console.error("Error in handleGenerate:", error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="mb-6">You need to log in to use the AI Generator feature.</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </Card>
      </div>
    );
  }

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
          {useFallback && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-4">
              <p className="font-medium">AI System Notice</p>
              <p>Our AI generation system is currently showing sample images. Full AI generation will be available soon. Thank you for your patience!</p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="prompt-house" className="block text-sm font-medium mb-2">
              Describe your dream home
            </label>
            <Textarea
              id="prompt-house"
              placeholder="E.g., A two-story modern farmhouse with large windows, wood accents, and an open floor plan..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
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
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(aiPrompt)}>
              Copy
            </Button>
            <Button onClick={handleGenerate} disabled={generatingImage}>
              {generatingImage ? (
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

        {generatingImage && (
          <div className="my-8 flex flex-col items-center">
            <div className="w-full max-w-md bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <RefreshCcw className="h-12 w-12 text-gray-400 animate-spin" />
            </div>
            <p className="mt-4 text-muted-foreground">Generating your design...</p>
          </div>
        )}

        {generatedImage && !generatingImage && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 font-playfair">
              Your Generated Design
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="relative group">
                <img 
                  src={generatedImage} 
                  alt="Generated design" 
                  className="w-full object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-white border-white hover:bg-white/20"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedImage;
                      link.download = "design.png";
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
