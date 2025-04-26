
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchitectInfo from "@/components/architect/ArchitectInfo";
import ArchitectDesigns from "@/components/architect/ArchitectDesigns";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ChatDialog } from "@/components/chat/ChatDialog";

const ArchitectProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchArchitectData = async () => {
      try {
        setIsLoading(true);
        
        if (!id) {
          throw new Error("Architect ID is missing");
        }

        // Fetch architect profile data
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .eq('role', 'architect')
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Architect not found");

        setProfileData(profileData);

        // Fetch architect designs
        const { data: designsData, error: designsError } = await supabase
          .from('designs')
          .select('*')
          .eq('user_id', id)
          .order('created_at', { ascending: false });

        if (designsError) throw designsError;
        setDesigns(designsData || []);

      } catch (error: any) {
        console.error("Error fetching architect data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load architect profile",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchitectData();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-design-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center flex-col">
          <h2 className="text-2xl font-semibold mb-4">Architect Not Found</h2>
          <Button onClick={() => navigate('/architects')}>
            Back to Architects
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {profileData.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profileData.username}</h1>
                  <p className="text-primary">{profileData.skills || "Architect"}</p>
                </div>
              </div>
              
              {user && user.id !== profileData.id && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              )}
            </div>

            <ArchitectInfo profileData={profileData} user={profileData} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Architect Designs</h2>
            {designs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">This architect hasn't uploaded any designs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design) => (
                  <div key={design.id} className="overflow-hidden rounded-lg border bg-card shadow-sm">
                    <div className="aspect-square relative">
                      <img
                        src={design.image_url}
                        alt={design.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{design.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      
      {profileData && (
        <ChatDialog
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          architect={profileData}
        />
      )}
    </div>
  );
};

export default ArchitectProfile;
