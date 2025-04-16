
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: number;
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

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  const [likedProjects, setLikedProjects] = useState<number[]>([]);
  const { toast } = useToast();

  const handleLike = (projectId: number) => {
    if (likedProjects.includes(projectId)) {
      setLikedProjects(likedProjects.filter(id => id !== projectId));
      toast({
        description: "Removed from favorites",
      });
    } else {
      setLikedProjects([...likedProjects, projectId]);
      toast({
        description: "Added to favorites",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden design-card border-none shadow-lg group">
          <div className="relative">
            <Link to={`/project/${project.id}`}>
              <div className="h-64 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="design-image"
                />
              </div>
            </Link>
            
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
              onClick={() => handleLike(project.id)}
            >
              <Heart
                className={`h-5 w-5 ${
                  likedProjects.includes(project.id)
                    ? "fill-design-primary text-design-primary"
                    : "text-muted-foreground"
                }`}
              />
            </Button>
            
            {/* Featured badge */}
            {project.featured && (
              <Badge className="absolute top-2 left-2 bg-design-primary hover:bg-design-primary/90">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-xl font-playfair leading-tight">
                <Link
                  to={`/project/${project.id}`}
                  className="hover:text-design-primary transition-colors"
                >
                  {project.title}
                </Link>
              </h3>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                {project.style}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {project.rooms} {project.rooms === 1 ? "Room" : "Rooms"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {project.size} sq ft
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <Link
                to={`/architect/${project.architectId}`}
                className="text-sm font-medium text-design-primary hover:underline"
              >
                {project.architect}
              </Link>
              <span className="text-xs text-muted-foreground">{project.location}</span>
            </div>
            
            <div className="mt-5 pt-4 border-t flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {new Date(project.date).toLocaleDateString()}
              </span>
              <Button variant="ghost" size="sm" className="text-design-primary" asChild>
                <Link to={`/project/${project.id}`} className="flex items-center">
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectGrid;
