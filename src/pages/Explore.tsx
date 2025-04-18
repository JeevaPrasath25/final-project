import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectFilters, { ProjectFilters as Filters } from "@/components/explore/ProjectFilters";
import ProjectGrid from "@/components/explore/ProjectGrid";
import { SectionHeading } from "@/components/ui/section-heading";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Design {
  id: string;
  title: string;
  image_url: string;
  user_id: string;
  created_at: string;
  users?: {
    username: string | null;
    social_links: string | null;
    avatar_url: string | null;
  } | null;
}

interface ProjectWithUser {
  id: number | string;
  title: string;
  description: string;
  imageUrl: string;
  architect: string;
  architectId: string;
  location: string;
  style: string;
  rooms: number;
  size: number;
  likes: number;
  date: string;
  featured?: boolean;
}

const Explore = () => {
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithUser[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectWithUser[]>([]);
  const [filters, setFilters] = useState<Filters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user designs from Supabase
    const fetchDesigns = async () => {
      try {
        setIsLoading(true);
        
        console.log("Fetching designs...");
        
        const { data: designsData, error } = await supabase
          .from('designs')
          .select(`
            id,
            title,
            image_url,
            user_id,
            created_at,
            users (
              username,
              social_links,
              avatar_url
            )
          `);

        if (error) {
          console.error("Error fetching designs:", error);
          setAllProjects(sampleProjects);
          return;
        }

        console.log("Fetched designs:", designsData);

        if (!designsData || designsData.length === 0) {
          console.log("No designs found, using sample projects");
          setAllProjects(sampleProjects);
          return;
        }

        // Transform designs to project format
        const userProjects: ProjectWithUser[] = designsData.map((design: Design) => ({
          id: design.id,
          title: design.title || "Untitled Design",
          description: "Design uploaded by an architect",
          imageUrl: design.image_url,
          architect: design.users?.username || "Architect",
          architectId: design.user_id,
          location: design.users?.social_links || "Unknown location",
          style: "modern", // Default style
          rooms: 3, // Default
          size: 2000, // Default
          likes: Math.floor(Math.random() * 100), // Random likes for demo
          date: design.created_at,
          featured: Math.random() > 0.7 // Random featured status for some designs
        }));

        console.log("Transformed user projects:", userProjects);

        // Combine sample projects with user designs
        const combinedProjects = [...userProjects, ...sampleProjects];
        setAllProjects(combinedProjects);
      } catch (err) {
        console.error("Error in fetchDesigns:", err);
        setAllProjects(sampleProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  useEffect(() => {
    // Apply filters
    if (allProjects.length === 0) {
      setFilteredProjects([]);
      return;
    }
    
    let result = [...allProjects];

    // Filter by style
    if (filters.style !== "all") {
      result = result.filter(project => project.style === filters.style);
    }

    // Filter by rooms
    if (filters.rooms !== "all") {
      if (filters.rooms === "5+") {
        result = result.filter(project => project.rooms >= 5);
      } else {
        result = result.filter(project => project.rooms === parseInt(filters.rooms));
      }
    }

    // Filter by size
    result = result.filter(
      project => project.size >= filters.size[0] && project.size <= filters.size[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "popular":
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "budget_low":
        result.sort((a, b) => a.size - b.size); // Using size as a proxy for budget
        break;
      case "budget_high":
        result.sort((a, b) => b.size - a.size); // Using size as a proxy for budget
        break;
      default:
        break;
    }

    setFilteredProjects(result);
  }, [filters, allProjects]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="Explore Designs"
            subtitle="Discover architectural projects and find inspiration for your next home"
            className="mb-8"
          />

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-64 flex-shrink-0">
              <ProjectFilters onFilterChange={handleFilterChange} />
            </aside>

            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {isLoading ? (
                    "Loading designs..."
                  ) : (
                    `Showing ${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`
                  )}
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : filteredProjects.length > 0 ? (
                <ProjectGrid projects={filteredProjects} />
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-xl font-medium mb-2">No projects found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
