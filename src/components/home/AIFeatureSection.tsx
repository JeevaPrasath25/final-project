
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sparkles } from "lucide-react";

const AIFeatureSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-design-soft-purple to-design-soft-blue">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title="Dream It, Generate It"
              subtitle="Use our AI-powered tool to visualize your dream home from a simple description"
              className="mb-6"
            />
            
            <p className="text-muted-foreground mb-8">
              Don't know where to start? Describe your dream home in words, and our AI will generate 
              visual concepts to inspire your journey. Refine and explore different styles until 
              you find the perfect design.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 bg-design-primary rounded-full p-2 text-white mt-1">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-lg font-medium">Instant Visualization</h4>
                  <p className="text-muted-foreground">
                    Turn your text descriptions into visual concepts in seconds
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-design-primary rounded-full p-2 text-white mt-1">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-lg font-medium">Style Exploration</h4>
                  <p className="text-muted-foreground">
                    Experiment with different architectural styles easily
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-design-primary rounded-full p-2 text-white mt-1">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-lg font-medium">Connect with Architects</h4>
                  <p className="text-muted-foreground">
                    Find professionals who can bring your AI concept to life
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="mt-8" asChild>
              <Link to="/ai-generator">Try AI Generator</Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="AI Generated Home Design" 
                className="rounded-lg w-full"
              />
              <div className="absolute -top-4 -right-4 bg-design-primary text-white py-2 px-4 rounded-full shadow-lg">
                <div className="flex items-center">
                  <Sparkles size={16} className="mr-2" />
                  <span className="font-medium">AI Generated</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 p-3 bg-white rounded-xl shadow-lg w-3/4 transform -rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" 
                alt="AI Generated Home Design" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatureSection;
