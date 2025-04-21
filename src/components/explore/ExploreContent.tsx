
import { useState } from "react";
import ProjectFilters, { ProjectFilters as Filters } from "@/components/explore/ProjectFilters";
import ProjectGrid from "@/components/explore/ProjectGrid";
import { SectionHeading } from "@/components/ui/section-heading";

const ExploreContent = () => {
  const [filters, setFilters] = useState<Filters>({
    style: "all",
    rooms: "all",
    size: [0, 5000],
    sortBy: "newest",
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
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
                Showing architect-uploaded designs
              </p>
            </div>
            <ProjectGrid />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExploreContent;
