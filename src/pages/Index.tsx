
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import AIFeatureSection from "@/components/home/AIFeatureSection";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedProjects />
        <HowItWorks />
        <AIFeatureSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
