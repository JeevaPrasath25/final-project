
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

export type ProjectFilters = {
  style: string;
  rooms: string;
  size: [number, number];
  sortBy: string;
  type: "house" | "floorplan";
};

interface ProjectFiltersProps {
  onFilterChange: (filters: ProjectFilters) => void;
  type: "house" | "floorplan";
}

const ProjectFilters = ({ onFilterChange, type }: ProjectFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<ProjectFilters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
    type: type
  });
  
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof ProjectFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters: ProjectFilters = {
      style: "all",
      rooms: "all",
      size: [0, 5000],
      sortBy: "newest",
      type: type
    };
    setFilters(defaultFilters);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {type === "house" ? (
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
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="contemporary">Contemporary</SelectItem>
              <SelectItem value="traditional">Traditional</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="scandinavian">Scandinavian</SelectItem>
              <SelectItem value="farmhouse">Farmhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
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
