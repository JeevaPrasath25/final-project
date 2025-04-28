
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  SlidersHorizontal, 
  X,
  ChevronDown 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { DESIGN_TYPES } from "@/types/design";

export type ProjectFilters = {
  style: string;
  rooms: string;
  size: [number, number];
  sortBy: string;
  type: "house" | "floorplan" | "inspiration" | "all";
  category: string;
};

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
  type: "house" | "floorplan" | "inspiration" | "all";
}

const ProjectFilters = ({ onFilterChange, type }: ProjectFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<ProjectFilters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
    type: type,
    category: "all"
  });
  
  useEffect(() => {
    // When type changes, update the category filter accordingly
    if (type !== "all") {
      setFilters(prev => ({...prev, category: type, type: type}));
    } else {
      setFilters(prev => ({...prev, type: type}));
    }
  }, [type]);
  
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    
    // If we change the category from floorplan to inspiration or vice versa, 
    // we should reset the related filters
    if (key === "category") {
      if (value === "floorplan") {
        updatedFilters.style = "all"; // Reset style when switching to floorplan
      } else if (value === "inspiration") {
        updatedFilters.rooms = "all"; // Reset rooms when switching to inspiration
        updatedFilters.size = [0, 5000]; // Reset size when switching to inspiration
      }
    }
    
    setFilters(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: ProjectFilters = {
      style: "all",
      rooms: "all",
      size: [0, 5000],
      sortBy: "newest",
      type: type,
      category: "all"
    };
    setFilters(defaultFilters);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium block mb-2">
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="inspiration">Design Inspiration</SelectItem>
            <SelectItem value="floorplan">Floor Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Design Style filter - only show for inspiration designs */}
      {(filters.category === "inspiration" || filters.category === "all") && (
        <div>
          <label className="text-sm font-medium block mb-2">
            Architectural Style
          </label>
          <Select
            value={filters.style}
            onValueChange={(value) => handleFilterChange("style", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Styles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {DESIGN_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Floor plan specific filters */}
      {(filters.category === "floorplan" || filters.category === "all") && (
        <>
          <div>
            <label className="text-sm font-medium block mb-2">Number of Rooms</label>
            <Select
              value={filters.rooms}
              onValueChange={(value) => handleFilterChange("rooms", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1 Room</SelectItem>
                <SelectItem value="2">2 Rooms</SelectItem>
                <SelectItem value="3">3 Rooms</SelectItem>
                <SelectItem value="4">4 Rooms</SelectItem>
                <SelectItem value="5+">5+ Rooms</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Size (sq ft)</label>
              <span className="text-sm text-muted-foreground">
                {filters.size[0]} - {filters.size[1]}
              </span>
            </div>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={filters.size}
              onValueChange={(value) => handleFilterChange("size", value as [number, number])}
              className="my-6"
            />
          </div>
        </>
      )}

      <div className="pt-4 flex justify-between">
        <Button variant="outline" onClick={resetFilters} size="sm">
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );

  const SortSelect = () => (
    <Select
      value={filters.sortBy}
      onValueChange={(value) => handleFilterChange("sortBy", value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
        <SelectItem value="popular">Most Popular</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
      <div className="flex items-center">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="bg-white p-4 rounded-lg border shadow-sm w-64">
            <h3 className="font-medium mb-4 flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </h3>
            <FiltersContent />
          </div>
        )}
      </div>

      <div className="ml-auto">
        <SortSelect />
      </div>
    </div>
  );
};

export default ProjectFilters;
