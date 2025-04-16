
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIGenerator from "@/components/ai/AIGenerator";

const AIGeneratorPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <AIGenerator />
      </main>
      <Footer />
    </div>
  );
};

export default AIGeneratorPage;
