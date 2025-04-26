
import { Design } from "@/hooks/useDesigns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface ProjectGridProps {
  filters?: ProjectFilters;
}

const ProjectGrid = ({ filters }: ProjectGridProps) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [likedDesigns, setLikedDesigns] = useState<string[]>([]);
  const [errorAttempts, setErrorAttempts] = useState(0);

  const fetchArchitectDesigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'architect');

      if (usersError) throw usersError;

      if (!users?.length) {
        setDesigns([]);
        return;
      }

      const architectIds = users.map(user => user.id);
      
      let query = supabase
        .from('posts')
        .select(`
          id,
          title,
          image_url,
          design_type,
          created_at,
          description,
          tags,
          user_id,
          user:user_id (
            username,
            role
          )
        `)
        .in('user_id', architectIds);
      
      // Apply category filter if specified
      if (filters?.category && filters.category !== "all") {
        if (filters.category === "floorplan") {
          // For floorplans, we look for tags that contain bedroom counts or room references
          query = query.or('tags.cs.{%bedroom%}, tags.cs.{%room%}, description.ilike.%floor plan%');
        } else if (filters.category === "inspiration") {
          // For design inspiration, we exclude floor plans
          query = query.not('tags', 'cs', '{%bedroom%}').not('tags', 'cs', '{%room%}').not('description', 'ilike', '%floor plan%');
        }
      }
      
      if (filters?.sortBy === "newest") {
        query = query.order('created_at', { ascending: false });
      } else if (filters?.sortBy === "oldest") {
        query = query.order('created_at', { ascending: true });
      } else if (filters?.sortBy === "popular") {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: designsError } = await query;

      if (designsError) throw designsError;

      if (!data || data.length === 0) {
        setDesigns([]);
        setIsLoading(false);
        return;
      }

      const formattedDesigns = data.map((design: any) => ({
        id: design.id,
        title: design.title,
        image_url: design.image_url,
        style: design.design_type,
        date: design.created_at,
        description: design.description,
        tags: design.tags || [],
        architect_name: design.user?.username || "Unknown Architect",
        architect_id: design.user?.id || "",
        user_id: design.user_id
      }));

      setDesigns(formattedDesigns);
    } catch (err: any) {
      console.error("Error in fetchArchitectDesigns:", err);
      setError("Could not load designs. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchitectDesigns();
  }, [filters?.sortBy, filters?.category]);

  useEffect(() => {
    if (error && errorAttempts === 0) {
      handleRetry();
    }
  }, [error]);

  const handleLike = (designId: string) => {
    setLikedDesigns(prev =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    setErrorAttempts(prev => prev + 1);
    try {
      await fetchArchitectDesigns();
    } catch (e) {
      console.error("Failed to fetch designs:", e);
    } finally {
      setIsRetrying(false);
    }
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
      <Alert variant="destructive" className="my-6">
        <AlertTitle className="text-lg font-medium">Connection error</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">We couldn't load the designs. Please check your internet connection and try again.</p>
          <Button 
            onClick={handleRetry} 
            variant="outline"
            disabled={isRetrying}
            className="mt-2"
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const applyFilters = () => {
    let filtered = [...designs];
    
    if (filters) {
      // Design style filter (for inspiration category)
      if (filters.style && filters.style !== "all") {
        filtered = filtered.filter(design => 
          design.style?.toLowerCase() === filters.style.toLowerCase() ||
          design.tags?.some(tag => tag.toLowerCase() === filters.style.toLowerCase())
        );
      }
      
      // Number of rooms filter (for floorplan category)
      if (filters.rooms && filters.rooms !== "all") {
        if (filters.rooms === "5+") {
          filtered = filtered.filter(design => {
            const roomIndicators = design.tags?.some(tag => {
              const roomCount = parseInt(tag.match(/(\d+)/)?.[1] || '0');
              return roomCount >= 5;
            });
            
            const descriptionIndicator = design.description?.toLowerCase().includes('5 bedroom') ||
              design.description?.toLowerCase().includes('5-bedroom') ||
              design.description?.toLowerCase().includes('6 bedroom') ||
              design.description?.toLowerCase().includes('6-bedroom');
            
            return roomIndicators || descriptionIndicator;
          });
        } else {
          const roomCount = filters.rooms;
          filtered = filtered.filter(design => {
            const hasRoomTag = design.tags?.some(tag => 
              tag.toLowerCase().includes(`${roomCount} bedroom`) || 
              tag.toLowerCase().includes(`${roomCount}-bedroom`) ||
              tag.toLowerCase().includes(`${roomCount} room`) ||
              tag.toLowerCase().includes(`${roomCount}-room`)
            );
            
            const mentionsInDescription = design.description?.toLowerCase().includes(`${roomCount} bedroom`) ||
              design.description?.toLowerCase().includes(`${roomCount}-bedroom`) ||
              design.description?.toLowerCase().includes(`${roomCount} room`) ||
              design.description?.toLowerCase().includes(`${roomCount}-room`);
            
            return hasRoomTag || mentionsInDescription;
          });
        }
      }
      
      // Size filter (for floorplan category)
      if (filters.size && (filters.size[0] > 0 || filters.size[1] < 5000)) {
        const [minSize, maxSize] = filters.size;
        
        filtered = filtered.filter(design => {
          if (design.tags) {
            for (const tag of design.tags) {
              const sizeMatch = tag.match(/(\d+)\s*sq\s*ft/i);
              if (sizeMatch) {
                const size = parseInt(sizeMatch[1]);
                return size >= minSize && size <= maxSize;
              }
            }
          }
          
          if (design.description) {
            const sizeMatch = design.description.match(/(\d+)\s*sq\s*ft/i);
            if (sizeMatch) {
              const size = parseInt(sizeMatch[1]);
              return size >= minSize && size <= maxSize;
            }
          }
          
          return true; // Include if no size information found
        });
      }
    }
    
    return filtered;
  };
  
  const filteredDesigns = applyFilters();

  if (!filteredDesigns.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <h3 className="text-xl font-medium mb-2">No architect designs found</h3>
        <p className="text-muted-foreground mb-6">No designs match your current filters or no architects have shared designs yet.</p>
        <Button onClick={() => window.location.reload()}>Reset Filters</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredDesigns.map((design) => {
        const isFloorPlan = 
          design.tags?.some(tag => tag.toLowerCase().includes('bedroom') || tag.toLowerCase().includes('room')) || 
          design.description?.toLowerCase().includes('floor plan');

        return (
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
                <Badge variant="outline" className="text-xs">
                  {isFloorPlan ? 'Floor Plan' : 'Design Inspiration'}
                </Badge>

                {design.style && (
                  <Badge variant="outline" className="text-xs">{design.style}</Badge>
                )}

                {design.date && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(design.date).toLocaleDateString()}
                  </span>
                )}

                {design.tags && design.tags.length > 0 && (
                  design.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                  ))
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
        );
      })}
    </div>
  );
};

export default ProjectGrid;
