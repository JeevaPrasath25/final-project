
import { ChevronRightIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";

// Sample project data
const featuredProjects = [
  {
    id: 1,
    title: "Minimalist Lakeside Villa",
    description: "A serene retreat with panoramic lake views and clean lines.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Elena Rodriguez",
    architectId: "elena-rodriguez",
    location: "Lake Como, Italy"
  },
  {
    id: 2,
    title: "Urban Garden House",
    description: "Sustainable living with integrated vertical gardens.",
    imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "James Wilson",
    architectId: "james-wilson",
    location: "Singapore"
  },
  {
    id: 3,
    title: "Coastal Modern Retreat",
    description: "Luxurious beachfront property with sustainable materials.",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    architect: "Sophia Chang",
    architectId: "sophia-chang",
    location: "Malibu, California"
  }
];

const FeaturedProjects = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto">
        <SectionHeading
          title="Featured Projects"
          subtitle="Discover exceptional architectural designs from our community"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden group design-card border-none shadow-lg">
              <Link to={`/project/${project.id}`}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="design-image"
                  />
                </div>
              </Link>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2 font-playfair">
                  <Link to={`/project/${project.id}`} className="hover:text-design-primary">
                    {project.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <Link to={`/architect/${project.architectId}`} className="text-sm font-medium text-design-primary hover:underline">
                    {project.architect}
                  </Link>
                  <span className="text-sm text-muted-foreground">{project.location}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/explore" className="inline-flex items-center">
              View all projects
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
