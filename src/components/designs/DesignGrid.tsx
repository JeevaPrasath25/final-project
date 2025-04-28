import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DesignCard from "./DesignCard";
import { Design } from "@/types/design";

interface DesignGridProps {
  designs: Design[];
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onUploadClick: () => void;
  onDeleteDesign?: (id: string) => void;
  onUpdateDesign?: (id: string, updates: Partial<Design>) => Promise<boolean>;
  showDetails?: boolean;
}

const DesignGrid = ({ 
  designs, 
  onLike, 
  onSave, 
  onUploadClick, 
  onDeleteDesign,
  onUpdateDesign,
  showDetails = true
}: DesignGridProps) => {
  if (designs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
        <h3 className="text-xl font-medium mb-2">No designs yet</h3>
        <p className="text-muted-foreground mb-6">
          Start by uploading your first design or generate one with AI.
        </p>
        <Button onClick={onUploadClick}>
          Upload a Design
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onLike={onLike}
          onSave={onSave}
          onDelete={onDeleteDesign}
          onUpdate={onUpdateDesign}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};

export default DesignGrid;
