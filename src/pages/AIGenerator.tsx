
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIGenerator from "@/components/ai/AIGenerator";

const AIGeneratorPage = () => {
  return (
    <>
      <Helmet>
        <title>AI Dream Home Generator | Design Next</title>
        <meta
          name="description"
          content="Generate dream home designs and floor plans with AI. Describe your vision and see it come to life."
        />
      </Helmet>
      <Header />
      <AIGenerator />
      <Footer />
    </>
  );
};

export default AIGeneratorPage;
