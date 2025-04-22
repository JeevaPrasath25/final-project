
import { useDesigns, Design } from "@/hooks/useDesigns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ProjectFilters } from "./ProjectFilters";

interface ProjectGridProps {
  filters?: ProjectFilters;
}

const ProjectGrid = ({ filters }: ProjectGridProps) => {
  const { designs, isLoading, error, fetchDesigns } = useDesigns();
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);
  const [filteredDesigns, setFilteredDesigns] = useState<Design[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  // Apply filters when designs or filters change
  useEffect(() => {
    if (!designs) return;
    
    let result = [...designs];
    
    if (filters) {
      // Apply style filter
      if (filters.style && filters.style !== "all") {
        result = result.filter(design => design.style === filters.style);
      }
      
      // Apply sorting
      if (filters.sortBy === "newest") {
        result = result.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
      } else if (filters.sortBy === "oldest") {
        result = result.sort((a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime());
      }
    }
    
    setFilteredDesigns(result);
  }, [designs, filters]);

  const handleLike = (designId: string) => {
    setLikedDesigns(prev =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await fetchDesigns();
    setIsRetrying(false);
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
      <div className="bg-red-50 text-red-700 p-8 rounded-md my-6 text-center">
        <div className="font-semibold mb-3 text-lg">Error loading designs</div>
        <div className="mb-5">{error}</div>
        <Button 
          onClick={handleRetry} 
          className="bg-red-600 hover:bg-red-700"
          disabled={isRetrying}
        >
          {isRetrying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </>
          )}
        </Button>
      </div>
    );
  }

  if (!filteredDesigns.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No architect designs found</h3>
        <p className="text-muted-foreground mb-6">No designs match your current filters or no architects have shared designs yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredDesigns.map((design) => (
        <Card key={design.id} className="overflow-hidden design-card border-none shadow-lg group">
          <Link to={`/project/${design.id}`}>
            <div className="h-64 overflow-hidden bg-gray-100">
              <img 
                src={design.image_url} 
                alt={design.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
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
            
            {design.architect_name && (
              <Link 
                to={`/architect/${design.architect_id}`} 
                className="text-sm font-medium text-design-primary hover:underline block mb-3"
              >
                by {design.architect_name}
              </Link>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {design.style && (
                <Badge variant="outline" className="text-xs">{design.style}</Badge>
              )}
              {design.date && (
                <span className="text-xs text-muted-foreground">
                  {new Date(design.date).toLocaleDateString()}
                </span>
              )}
            </div>

            <Button variant="ghost" size="sm" className="text-design-primary w-full" asChild>
              <Link to={`/project/${design.id}`} className="flex items-center justify-center">
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
