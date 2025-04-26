
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import ArchitectUploadForm from "@/components/designs/ArchitectUploadForm";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DesignUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto">
            <Card className="p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
              <p className="mb-6">You need to log in to upload designs.</p>
              <Button asChild>
                <a href="/login">Log In</a>
              </Button>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading
            title="Upload Design"
            subtitle="Share your architectural designs with the community"
            className="mb-10"
          />
          
          <div className="grid grid-cols-1 gap-8">
            <ArchitectUploadForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignUpload;
