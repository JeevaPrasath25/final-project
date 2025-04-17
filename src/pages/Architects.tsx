
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchitectCard from "@/components/architects/ArchitectCard";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Interface that matches the database structure
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

// Interface expected by the ArchitectCard component
export interface ArchitectDisplayData {
  id: string;
  name: string;
  profileImage: string;
  specialty: string;
  bio: string;
  location: string;
  rating: number;
  projects: number;
  available: boolean;
  tags: string[];
}

const Architects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [architects, setArchitects] = useState<ArchitectUser[]>([]);
  const [displayArchitects, setDisplayArchitects] = useState<ArchitectDisplayData[]>([]);
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
        
        // Store original data
        setArchitects(data);
        
        // Transform data to match ArchitectCard props
        const architectData = data.map((user: ArchitectUser) => ({
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

        setDisplayArchitects(architectData);
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
      const defaultDisplay = architects.map(architect => ({
        id: architect.id,
        name: architect.username || "Architect",
        profileImage: architect.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
        specialty: architect.skills || "Architecture Design",
        bio: architect.bio || "Professional architect with design expertise.",
        location: architect.social_links || "Location not specified",
        rating: 4.5,
        projects: 0,
        available: true,
        tags: architect.experience ? [architect.experience] : ["Architecture"]
      }));
      setDisplayArchitects(defaultDisplay);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = displayArchitects.filter(
      architect =>
        architect.name.toLowerCase().includes(query) ||
        architect.specialty.toLowerCase().includes(query) ||
        architect.location.toLowerCase().includes(query) ||
        architect.tags.some(tag => tag.toLowerCase().includes(query))
    );

    setDisplayArchitects(results);
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
          ) : displayArchitects.length > 0 ? (
            <div className="space-y-8">
              {displayArchitects.map((architect) => (
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
                const defaultDisplay = architects.map(architect => ({
                  id: architect.id,
                  name: architect.username || "Architect",
                  profileImage: architect.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg",
                  specialty: architect.skills || "Architecture Design",
                  bio: architect.bio || "Professional architect with design expertise.",
                  location: architect.social_links || "Location not specified",
                  rating: 4.5,
                  projects: 0,
                  available: true,
                  tags: architect.experience ? [architect.experience] : ["Architecture"]
                }));
                setSearchQuery("");
                setDisplayArchitects(defaultDisplay);
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
