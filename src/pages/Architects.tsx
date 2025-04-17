
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchitectCard from "@/components/architects/ArchitectCard";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Architect {
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
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [filteredArchitects, setFilteredArchitects] = useState<Architect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch architects from database
  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'architect');

        if (error) {
          console.error("Error fetching architects:", error);
          throw error;
        }

        console.log("Fetched architects:", data);
        
        // Transform data to match ArchitectCard props
        const architectData = data.map((user: Architect) => ({
          id: user.id,
          name: user.username || "Architect",
          profileImage: user.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg", // default avatar
          specialty: user.skills || "Architecture Design",
          bio: user.bio || "Professional architect with design expertise.",
          location: user.social_links || "Location not specified",
          rating: 4.5, // Default rating
          projects: 0, // Default projects count
          available: true, // Default availability
          tags: user.experience ? [user.experience] : ["Architecture"]
        }));

        setArchitects(architectData);
        setFilteredArchitects(architectData);
      } catch (error) {
        console.error("Failed to fetch architects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchitects();
  }, []);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredArchitects(architects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = architects.filter(
      architect =>
        architect.name.toLowerCase().includes(query) ||
        architect.specialty.toLowerCase().includes(query) ||
        architect.location.toLowerCase().includes(query) ||
        architect.tags.some(tag => tag.toLowerCase().includes(query))
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

          {/* Search bar */}
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

          {/* Architects grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredArchitects.length > 0 ? (
            <div className="space-y-8">
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
