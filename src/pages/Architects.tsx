
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

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

const Architects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [architects, setArchitects] = useState<ArchitectUser[]>([]);
  const [filteredArchitects, setFilteredArchitects] = useState<ArchitectUser[]>([]);
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
        setFilteredArchitects(data);
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
    const results = architects.filter(architect => 
      architect.username?.toLowerCase().includes(query) ||
      architect.skills?.toLowerCase().includes(query) ||
      architect.social_links?.toLowerCase().includes(query) ||
      architect.experience?.toLowerCase().includes(query) ||
      architect.bio?.toLowerCase().includes(query)
    );

    setFilteredArchitects(results);
  };

  const getInitial = (name: string | null) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchitects.map((architect) => (
                <Card key={architect.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={architect.avatar_url || undefined} alt={architect.username} />
                        <AvatarFallback className="bg-primary text-white text-lg">
                          {getInitial(architect.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{architect.username}</h3>
                        {architect.skills && (
                          <p className="text-sm text-primary">{architect.skills}</p>
                        )}
                      </div>
                    </div>
                    
                    {architect.bio && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{architect.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {architect.experience && (
                        <Badge variant="outline">{architect.experience}</Badge>
                      )}
                      {architect.social_links && (
                        <Badge variant="outline">{architect.social_links}</Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button asChild variant="default" size="sm">
                        <Link to={`/architect/${architect.id}`}>View Profile</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
