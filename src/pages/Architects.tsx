
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArchitectCard from "@/components/architects/ArchitectCard";
import { SectionHeading } from "@/components/ui/section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Sample architects data
const architectsData = [
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    specialty: "Modern Minimalist Design",
    bio: "Award-winning architect with over 10 years of experience specializing in sustainable luxury homes that blend seamlessly with their surroundings.",
    location: "Barcelona, Spain",
    rating: 4.9,
    projects: 24,
    available: true,
    tags: ["Luxury Homes", "Sustainable", "Minimalist", "Coastal"]
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    specialty: "Urban Eco Architecture",
    bio: "Creating innovative urban housing solutions that incorporate green spaces and sustainable technologies for better city living.",
    location: "Singapore",
    rating: 4.7,
    projects: 18,
    available: true,
    tags: ["Eco-friendly", "Urban", "Smart Homes", "Contemporary"]
  },
  {
    id: "sophia-chang",
    name: "Sophia Chang",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    specialty: "Luxury Coastal Homes",
    bio: "Specializes in designing stunning beachfront properties that maximize ocean views while incorporating sustainable materials and resistant to coastal conditions.",
    location: "Los Angeles, USA",
    rating: 4.8,
    projects: 31,
    available: false,
    tags: ["Beachfront", "Luxury", "Contemporary", "Open Concept"]
  },
  {
    id: "marcus-jensen",
    name: "Marcus Jensen",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    specialty: "Nordic Minimalism",
    bio: "Bringing Scandinavian design principles to residential architecture with a focus on functionality, light, and connection to nature.",
    location: "Copenhagen, Denmark",
    rating: 4.9,
    projects: 27,
    available: true,
    tags: ["Scandinavian", "Minimalist", "Wood", "Natural Light"]
  },
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    profileImage: "https://randomuser.me/api/portraits/women/42.jpg",
    specialty: "Mediterranean Villa Design",
    bio: "Preserving the essence of Mediterranean architecture while incorporating modern amenities and sustainable practices.",
    location: "Santorini, Greece",
    rating: 4.6,
    projects: 22,
    available: true,
    tags: ["Mediterranean", "Villa", "Traditional", "Courtyard"]
  },
  {
    id: "daniel-smith",
    name: "Daniel Smith",
    profileImage: "https://randomuser.me/api/portraits/men/52.jpg",
    specialty: "Industrial Conversions",
    bio: "Transforming industrial spaces into unique living environments that honor the original architecture while adding modern comforts.",
    location: "Brooklyn, NY",
    rating: 4.7,
    projects: 19,
    available: false,
    tags: ["Industrial", "Loft", "Conversion", "Urban"]
  }
];

const Architects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArchitects, setFilteredArchitects] = useState(architectsData);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredArchitects(architectsData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = architectsData.filter(
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
          {filteredArchitects.length > 0 ? (
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
                setFilteredArchitects(architectsData);
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
