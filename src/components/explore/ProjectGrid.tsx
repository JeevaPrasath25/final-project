
import { useDesigns } from "@/hooks/useDesigns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ProjectGrid = () => {
  const { designs, isLoading, error } = useDesigns();
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);

  const handleLike = (designId: string) => {
    setLikedDesigns(prev =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-28">
        <Loader2 className="h-8 w-8 animate-spin text-design-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md my-6 text-center">
        <div className="font-semibold mb-1">Error loading designs</div>
        <div>{error}</div>
      </div>
    );
  }

  if (!designs.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No architect designs yet</h3>
        <p className="text-muted-foreground mb-6">Architects haven't shared any designs yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {designs.map((design) => (
        <Card key={design.id} className="overflow-hidden design-card border-none shadow-lg group">
          <Link to={`/project/${design.id}`}>
            <div className="h-64 overflow-hidden bg-gray-100">
              <img src={design.image_url} alt={design.title} className="design-image w-full h-full object-cover" />
            </div>
          </Link>

          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-xl font-playfair leading-tight">
                <Link to={`/project/${design.id}`} className="hover:text-design-primary transition-colors">
                  {design.title}
                </Link>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => handleLike(design.id)}
              >
                <Heart
                  className={`h-5 w-5 ${likedDesigns.includes(design.id)
                    ? "fill-design-primary text-design-primary"
                    : "text-muted-foreground"
                  }`}
                />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {design.style && (
                <Badge variant="outline" className="text-xs">{design.style}</Badge>
              )}
              {design.rooms && (
                <Badge variant="outline" className="text-xs">{design.rooms} Room{design.rooms > 1 ? "s" : ""}</Badge>
              )}
              {design.size && (
                <Badge variant="outline" className="text-xs">{design.size} sq ft</Badge>
              )}
              {design.featured && (
                <Badge className="bg-design-primary hover:bg-design-primary/90">Featured</Badge>
              )}
            </div>
            <div className="flex justify-between items-center mb-3">
              <Link to={`/architect/${design.architect_id}`} className="text-sm font-medium text-design-primary hover:underline">
                {design.architect_name}
              </Link>
              <span className="text-xs text-muted-foreground">{design.date && new Date(design.date).toLocaleDateString()}</span>
            </div>
            <Button variant="ghost" size="sm" className="text-design-primary mt-2" asChild>
              <Link to={`/project/${design.id}`} className="flex items-center">
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectGrid;
