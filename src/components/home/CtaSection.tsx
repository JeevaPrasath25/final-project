
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-24 bg-design-dark text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair mb-6 max-w-3xl mx-auto">
          Ready to Transform Your Living Space?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join DesignNext today to explore architectural masterpieces, connect with talented 
          professionals, or showcase your own design portfolio.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
            <Link to="/for-architects">For Architects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
