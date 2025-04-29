
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIGenerator from "@/components/ai/AIGenerator";

const AIGeneratorPage = () => {
  return (
    <>
      <Helmet>
        <title>AI Dream Home Generator | Design Next</title>
        <meta
          name="description"
          content="Generate dream home designs with AI. Describe your vision and see it come to life."
        />
      </Helmet>
      <Navbar />
      <AIGenerator />
      <Footer />
    </>
  );
};

export default AIGeneratorPage;
