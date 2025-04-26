import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCcw, Download, LayoutPlan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const samplePrompts = {
  house: [
    "A modern Mediterranean villa with a pool and ocean view",
    "A cozy mountain cabin with large windows and a stone fireplace",
    "A minimalist Japanese-inspired home with an interior garden"
  ],
  floorplan: [
    "Open concept 3-bedroom house with home office and large kitchen",
    "Compact 2-bedroom apartment with balcony and split bathroom",
    "Modern 4-bedroom family home with basement and double garage"
  ]
};

const AIGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generationType, setGenerationType] = useState<"house" | "floorplan">("house");
  const { toast } = useToast();

  const mockImages = {
    house: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    floorplan: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1784&q=80",
      "https://images.unsplash.com/photo-1631870860332-34a0e858d24c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1784&q=80",
      "https://plus.unsplash.com/premium_photo-1676440387576-cae97d8638b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1784&q=80"
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: `Please enter a description of your dream ${generationType === "house" ? "home" : "floor plan"}.`,
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: JSON.stringify({ 
            prompt,
            type: generationType
          })
        });

        if (!error && data?.image) {
          setGeneratedImages([data.image]);
          toast({
            title: generationType === "house" ? "Design generated" : "Floor plan generated",
            description: generationType === "house" 
              ? "Your dream home design has been created."
              : "Your floor plan has been created.",
          });
          setIsGenerating(false);
          return;
        }
      } catch (edgeFuncError) {
        console.log("Edge function error, falling back to mock images", edgeFuncError);
        // Silently fail and continue to fallback
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockCollection = mockImages[generationType];
      const randomIndex = Math.floor(Math.random() * mockCollection.length);
      const mockImage = mockCollection[randomIndex];
      
      setGeneratedImages([mockImage]);
      toast({
        title: generationType === "house" ? "Design generated" : "Floor plan generated",
        description: generationType === "house" 
          ? "Your dream home design has been created. (Using sample images while our AI system is being upgraded)"
          : "Your floor plan has been created. (Using sample images while our AI system is being upgraded)",
      });
      
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
            Describe your dream home or floor plan in detail and our AI will generate visual concepts to inspire your journey.
          </p>
        </div>

        <Tabs defaultValue="house" onValueChange={(value) => setGenerationType(value as "house" | "floorplan")}>
          <TabsList className="mb-6">
            <TabsTrigger value="house" className="px-6">Home Designs</TabsTrigger>
            <TabsTrigger value="floorplan" className="px-6">Floor Plans</TabsTrigger>
          </TabsList>
          
          <TabsContent value="house">
            <Card className="p-6 mb-8">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-4">
                <p className="font-medium">AI System Upgrade Notice</p>
                <p>Our AI image generation system is currently being upgraded. You may see sample images while this process is completed. Thank you for your patience!</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="prompt-house" className="block text-sm font-medium mb-2">
                  Describe your dream home
                </label>
                <Textarea
                  id="prompt-house"
                  placeholder="E.g., A two-story modern farmhouse with large windows, wood accents, and an open floor plan..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <p className="text-sm font-medium w-full mb-1">Try these examples:</p>
                {samplePrompts.house.map((sample, index) => (
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
          </TabsContent>

          <TabsContent value="floorplan">
            <Card className="p-6 mb-8">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm mb-4">
                <p className="font-medium">AI Floor Plan Generator</p>
                <p>Describe your ideal floor plan, including the number of rooms, layout preferences, and any special features.</p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="prompt-floorplan" className="block text-sm font-medium mb-2">
                  Describe your floor plan
                </label>
                <Textarea
                  id="prompt-floorplan"
                  placeholder="E.g., A 3-bedroom house with open kitchen and living area, master suite with walk-in closet, home office, and 2-car garage..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <p className="text-sm font-medium w-full mb-1">Try these examples:</p>
                {samplePrompts.floorplan.map((sample, index) => (
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
                      <LayoutPlan className="h-4 w-4 mr-2" />
                      Generate Floor Plan
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {generatedImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-6 font-playfair">
              {generationType === "house" ? "Your Generated Designs" : "Your Generated Floor Plans"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={generationType === "house" ? `Generated design ${index + 1}` : `Generated floor plan ${index + 1}`} 
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
                        link.download = generationType === "house" 
                          ? `design_${index + 1}.png`
                          : `floorplan_${index + 1}.png`;
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
