
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectFilters, { ProjectFilters as Filters } from "@/components/explore/ProjectFilters";
import ProjectGrid from "@/components/explore/ProjectGrid";
import { SectionHeading } from "@/components/ui/section-heading";
import { supabase } from "@/integrations/supabase/client";

// Sample projects data
const allSampleProjects = [
  {
    id: 1,
    title: "Minimalist Lakeside Villa",
    description: "A serene retreat with panoramic lake views and clean lines, perfect for those seeking tranquility in nature.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Elena Rodriguez",
    architectId: "elena-rodriguez",
    location: "Lake Como, Italy",
    style: "minimalist",
    rooms: 4,
    size: 3200,
    likes: 245,
    date: "2024-03-15",
    featured: true
  },
  {
    id: 2,
    title: "Urban Garden House",
    description: "Sustainable living with integrated vertical gardens in the heart of a bustling metropolis.",
    imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "James Wilson",
    architectId: "james-wilson",
    location: "Singapore",
    style: "contemporary",
    rooms: 3,
    size: 1800,
    likes: 189,
    date: "2024-02-28"
  },
  {
    id: 3,
    title: "Coastal Modern Retreat",
    description: "Luxurious beachfront property with sustainable materials and panoramic ocean views.",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Sophia Chang",
    architectId: "sophia-chang",
    location: "Malibu, California",
    style: "modern",
    rooms: 5,
    size: 4200,
    likes: 310,
    date: "2024-03-05"
  },
  {
    id: 4,
    title: "Nordic Forest Cabin",
    description: "Minimalist cabin nestled among pine trees, featuring natural materials and large windows.",
    imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Marcus Jensen",
    architectId: "marcus-jensen",
    location: "Oslo, Norway",
    style: "scandinavian",
    rooms: 2,
    size: 1200,
    likes: 175,
    date: "2024-01-20"
  },
  {
    id: 5,
    title: "Mediterranean Courtyard Villa",
    description: "Traditional Mediterranean villa with a central courtyard and terracotta roof tiles.",
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Isabella Rossi",
    architectId: "isabella-rossi",
    location: "Santorini, Greece",
    style: "mediterranean",
    rooms: 4,
    size: 2800,
    likes: 232,
    date: "2024-02-10",
    featured: true
  },
  {
    id: 6,
    title: "Industrial Loft Conversion",
    description: "Former warehouse transformed into a spacious loft with original industrial elements.",
    imageUrl: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Daniel Smith",
    architectId: "daniel-smith",
    location: "Brooklyn, NY",
    style: "industrial",
    rooms: 2,
    size: 2100,
    likes: 168,
    date: "2024-03-22"
  }
];

interface Design {
  id: string;
  title: string;
  image_url: string;
  user_id: string;
  created_at: string;
  users?: {
    username: string | null;
    social_links: string | null;
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
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithUser[]>(allSampleProjects);
  const [allProjects, setAllProjects] = useState<ProjectWithUser[]>(allSampleProjects);
  const [filters, setFilters] = useState<Filters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
  });

  useEffect(() => {
    // Fetch user designs from Supabase
    const fetchDesigns = async () => {
      try {
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
              social_links
            )
          `);

        if (error) {
          console.error("Error fetching designs:", error);
          return;
        }

        if (!designsData) return;

        // Transform designs to project format
        const userProjects: ProjectWithUser[] = designsData.map((design: any) => ({
          id: design.id,
          title: design.title,
          description: "Design uploaded by an architect",
          imageUrl: design.image_url,
          architect: design.users?.username || "Architect",
          architectId: design.user_id,
          location: design.users?.social_links || "Unknown location",
          style: "modern", // Default style
          rooms: 3, // Default
          size: 2000, // Default
          likes: 0, // Default
          date: design.created_at,
        }));

        // Combine sample projects with user designs
        setAllProjects([...userProjects, ...allSampleProjects]);
      } catch (err) {
        console.error("Error in fetchDesigns:", err);
      }
    };

    fetchDesigns();
  }, []);

  useEffect(() => {
    // Apply filters
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
                  Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredProjects.length > 0 ? (
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
