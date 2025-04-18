import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArchitectDisplayData } from "@/types/architect";

const FeaturedArchitects = () => {
  const [featuredArchitects, setFeaturedArchitects] = useState<ArchitectDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArchitects = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'architect')
          .limit(4);

        if (error) {
          console.error("Error fetching featured architects:", error);
          throw error;
        }

        // Transform data to match component props
        const architectData = data.map((user: any) => ({
          id: user.id,
          name: user.username || "Architect",
          specialty: user.skills || "Architecture Design",
          profileImage: user.avatar_url || "https://randomuser.me/api/portraits/lego/1.jpg", 
          bio: user.bio || "Professional architect with design expertise.",
          projects: 0, // Default projects count
          location: user.social_links || "Location not specified",
          rating: 4.5, // Default rating
          available: true, // Default availability
          tags: user.experience ? [user.experience] : ["Architecture"]
        }));

        setFeaturedArchitects(architectData);
      } catch (error) {
        console.error("Failed to fetch featured architects:", error);
        // Fallback to sample data if there's an error
        setFeaturedArchitects([
          {
            id: "sample-1",
            name: "Elena Rodriguez",
            specialty: "Modern Minimalist Design",
            profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
            bio: "Award-winning architect with a focus on sustainable luxury homes.",
            projects: 24,
            location: "Barcelona, Spain",
            rating: 4.9,
            available: true,
            tags: ["Minimalist", "Sustainable", "Luxury"]
          },
          {
            id: "sample-2",
            name: "James Wilson",
            specialty: "Urban Eco Architecture",
            profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
            bio: "Specializes in eco-friendly urban housing solutions and green spaces.",
            projects: 18,
            location: "Singapore",
            rating: 4.7,
            available: true,
            tags: ["Eco-friendly", "Urban", "Housing"]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchitects();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-design-soft-purple/30">
        <div className="container mx-auto">
          <SectionHeading
            title="Our Top Architects"
            subtitle="Connect with talented architects ready to bring your vision to life"
            centered
          />
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-design-soft-purple/30">
      <div className="container mx-auto">
        <SectionHeading
          title="Our Top Architects"
          subtitle="Connect with talented architects ready to bring your vision to life"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredArchitects.map((architect) => (
            <div key={architect.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={architect.profileImage} alt={architect.name} />
                  <AvatarFallback>{architect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-1">{architect.name}</h3>
                <p className="text-design-primary text-sm mb-3">{architect.specialty}</p>
                <p className="text-muted-foreground text-sm text-center mb-4 line-clamp-3">{architect.bio}</p>
                <div className="flex justify-between w-full text-sm mb-4">
                  <span className="text-muted-foreground">{architect.location}</span>
                  <span className="font-medium">{architect.projects} Projects</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/architect/${architect.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/architects" className="inline-flex items-center">
              Browse all architects
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArchitects;
