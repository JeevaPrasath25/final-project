
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ExploreContent from "@/components/explore/ExploreContent";

const Explore = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ExploreContent />
      <Footer />
    </div>
  );
};

export default Explore;
