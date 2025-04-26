
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ArchitectCard from "@/components/architects/ArchitectCard";
import { useAuth } from "@/contexts/AuthContext";

interface ArchitectUser {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  experience: string | null;
  skills: string | null;
  social_links: string | null;
  role: string;
}

const Architects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [architects, setArchitects] = useState<ArchitectUser[]>([]);
  const [filteredArchitects, setFilteredArchitects] = useState<ArchitectUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'architect')
          .neq('id', user?.id);

        if (error) {
          console.error("Error fetching architects:", error);
          throw error;
        }
        
        setArchitects(data || []);
        setFilteredArchitects(data || []);
      } catch (error) {
        console.error("Failed to fetch architects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchitects();
  }, [user?.id]);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredArchitects(architects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = architects.filter(architect => 
      architect.username?.toLowerCase().includes(query) ||
      architect.skills?.toLowerCase().includes(query) ||
      architect.social_links?.toLowerCase().includes(query) ||
      architect.experience?.toLowerCase().includes(query) ||
      architect.bio?.toLowerCase().includes(query)
    );

    setFilteredArchitects(results);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="Find Your Architect"
            subtitle="Connect with professional architects who can bring your vision to life"
            centered
          />

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name, specialty, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-20"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                className="absolute right-0 top-0 h-full rounded-l-none"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredArchitects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchitects.map((architect) => (
                <ArchitectCard key={architect.id} architect={architect} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-xl font-medium mb-2">No architects found</p>
              <p className="text-muted-foreground mb-4">
                Try searching with different keywords
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setFilteredArchitects(architects);
              }}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Architects;
