
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Bookmark, Trash2, Info } from "lucide-react";
import { Design } from "@/hooks/useDesigns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import DesignDetailDialog from "./DesignDetailDialog";

interface DesignCardProps {
  design: Design;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Design>) => Promise<boolean>;
  showDetails?: boolean;
}

const DesignCard = ({ 
  design, 
  onLike, 
  onSave, 
  onDelete,
  onUpdate,
  showDetails = true
}: DesignCardProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const isFloorplan = design.metadata?.category === "floorplan";
  
  return (
    <>
      <Card key={design.id} className="overflow-hidden">
        <div className="relative pb-[66%] bg-gray-100">
          <img
            src={design.image_url}
            alt={design.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Design?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this design? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(design.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium truncate flex-grow">{design.title}</h3>
            <div className="flex space-x-2 ml-2">
              {onUpdate && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-blue-500"
                  onClick={() => setIsDetailOpen(true)}
                >
                  <Info className="h-5 w-5" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className={design.liked_by_user ? "text-red-500" : "text-gray-500"}
                onClick={() => onLike(design.id, !!design.liked_by_user)}
              >
                <Heart className="h-5 w-5" fill={design.liked_by_user ? "currentColor" : "none"} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={design.saved_by_user ? "text-yellow-500" : "text-gray-500"}
                onClick={() => onSave(design.id, !!design.saved_by_user)}
              >
                <Bookmark className="h-5 w-5" fill={design.saved_by_user ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">
              {isFloorplan ? 'Floor Plan' : 'Design Inspiration'}
            </Badge>
          </div>
          
          {/* Metadata Display */}
          {showDetails && design.metadata && (
            <div className="mt-3 text-sm text-muted-foreground">
              {isFloorplan ? (
                <div className="flex justify-between">
                  <span>{design.metadata.rooms} {parseInt(design.metadata.rooms as unknown as string) === 1 ? 'Room' : 'Rooms'}</span>
                  <span>{design.metadata.squareFeet} sq ft</span>
                </div>
              ) : (
                <div>
                  <span>Style: {design.metadata.designType?.charAt(0).toUpperCase()}{design.metadata.designType?.slice(1)}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex space-x-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" /> {design.design_likes?.count || 0}
            </span>
            <span className="flex items-center">
              <Bookmark className="h-4 w-4 mr-1" /> {design.design_saves?.count || 0}
            </span>
          </div>
        </CardContent>
      </Card>

      {onUpdate && (
        <DesignDetailDialog
          design={design}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default DesignCard;
