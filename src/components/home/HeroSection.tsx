
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-design-dark">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Modern architecture"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto py-28 md:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white font-playfair mb-6">
            Discover & Create Your Dream Home
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Connect with talented architects or find inspiration for your next home project. 
            Design your future living space with DesignNext.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild>
              <Link to="/explore">Explore Designs</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/architects">Find Architects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
