
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCcw, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const samplePrompts = [
  "A minimalist single-story house with large windows and a green roof",
  "A modern Mediterranean villa with a courtyard and pool",
  "A rustic mountain cabin with large windows facing a lake view",
  "A futuristic urban apartment with sustainable features"
];

// Sample AI-generated images for demo purposes
const sampleImages = [
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
];

const AIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a description of your dream home.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation with a delay
    setTimeout(() => {
      // For demo purposes, using sample images
      setGeneratedImages(sampleImages);
      setIsGenerating(false);
      
      toast({
        title: "Design generated",
        description: "Your dream home designs have been created.",
      });
    }, 2000);
  };

  const handleSamplePrompt = (sample: string) => {
    setPrompt(sample);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied to clipboard",
      description: "Your prompt has been copied to clipboard."
    });
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

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleCopyPrompt}>
              <Copy className="h-4 w-4 mr-2" />
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
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Love one of these designs? Connect with an architect who can bring it to life.
              </p>
              <Button asChild>
                <a href="/architects">Find an Architect</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGenerator;
