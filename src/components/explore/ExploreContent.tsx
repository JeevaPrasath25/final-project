
import { useState } from "react";
import ProjectFilters, { ProjectFilters as Filters } from "@/components/explore/ProjectFilters";
import ProjectGrid from "@/components/explore/ProjectGrid";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const ExploreContent = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
    type: "all",
    category: "all"
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      style: "all",
      rooms: "all",
      size: [0, 5000],
      sortBy: "newest",
      type: filters.type,
      category: "all"
    });
  };

  const hasActiveFilters = 
    filters.style !== "all" || 
    filters.rooms !== "all" || 
    filters.size[0] > 0 || 
    filters.size[1] < 5000 ||
    filters.category !== "all";

  if (!user) {
    return (
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-6">You need to log in to explore architect designs.</p>
            <Button asChild>
              <a href="/login">Log In</a>
            </Button>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto">
        <SectionHeading
          title="Explore Architect Designs"
          subtitle="Browse professional architectural designs and find your perfect match"
          className="mb-8"
        />

        <Tabs 
          defaultValue="all" 
          onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as "house" | "floorplan" | "inspiration" | "all" }))}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Designs</TabsTrigger>
            <TabsTrigger value="inspiration">Design Inspirations</TabsTrigger>
            <TabsTrigger value="floorplan">Floor Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="md:w-64 flex-shrink-0">
                <ProjectFilters onFilterChange={handleFilterChange} type="all" />
              </aside>
              <div className="flex-grow">
                <ActiveFilterDisplay 
                  filters={filters} 
                  setFilters={setFilters} 
                  resetFilters={resetFilters} 
                  hasActiveFilters={hasActiveFilters}
                />
                <ProjectGrid filters={filters} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inspiration">
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="md:w-64 flex-shrink-0">
                <ProjectFilters onFilterChange={handleFilterChange} type="inspiration" />
              </aside>
              <div className="flex-grow">
                <ActiveFilterDisplay 
                  filters={filters} 
                  setFilters={setFilters} 
                  resetFilters={resetFilters} 
                  hasActiveFilters={hasActiveFilters}
                />
                <ProjectGrid filters={filters} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="floorplan">
            <div className="flex flex-col md:flex-row gap-8">
              <aside className="md:w-64 flex-shrink-0">
                <ProjectFilters onFilterChange={handleFilterChange} type="floorplan" />
              </aside>
              <div className="flex-grow">
                <ActiveFilterDisplay 
                  filters={filters} 
                  setFilters={setFilters} 
                  resetFilters={resetFilters} 
                  hasActiveFilters={hasActiveFilters}
                />
                <ProjectGrid filters={filters} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

interface ActiveFilterDisplayProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const ActiveFilterDisplay = ({ filters, setFilters, resetFilters, hasActiveFilters }: ActiveFilterDisplayProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        <p className="text-muted-foreground">
          Showing designs posted by professional architects
        </p>
        
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-4">
            {filters.category !== "all" && (
              <Badge variant="outline" className="px-3 py-1">
                Category: {filters.category}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-2 p-0"
                  onClick={() => setFilters({...filters, category: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.style !== "all" && (
              <Badge variant="outline" className="px-3 py-1">
                Style: {filters.style}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-2 p-0"
                  onClick={() => setFilters({...filters, style: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {filters.rooms !== "all" && (
              <Badge variant="outline" className="px-3 py-1">
                Rooms: {filters.rooms}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-2 p-0"
                  onClick={() => setFilters({...filters, rooms: "all"})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            {(filters.size[0] > 0 || filters.size[1] < 5000) && (
              <Badge variant="outline" className="px-3 py-1">
                Size: {filters.size[0]}-{filters.size[1]} sq ft
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 ml-2 p-0"
                  onClick={() => setFilters({...filters, size: [0, 5000]})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={resetFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreContent;
