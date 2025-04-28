
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Design } from "@/hooks/useDesigns";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save } from "lucide-react";
import { DESIGN_TYPES } from "@/types/design";

interface DesignDetailDialogProps {
  design: Design | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Design>) => Promise<boolean>;
}

const DesignDetailDialog = ({ design, isOpen, onClose, onUpdate }: DesignDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [designType, setDesignType] = useState<string>("modern");
  const [rooms, setRooms] = useState<number>(1);
  const [squareFeet, setSquareFeet] = useState<number>(1000);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Reset form when design changes
  const resetForm = () => {
    if (design) {
      setTitle(design.title);
      setDesignType(design.metadata?.designType || "modern");
      setRooms(design.metadata?.rooms || 1);
      setSquareFeet(design.metadata?.squareFeet || 1000);
    }
    setIsEditing(false);
  };

  // Initialize form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open && design) {
      resetForm();
    }
    if (!open) {
      onClose();
    }
  };

  const handleSave = async () => {
    if (!design) return;
    
    setIsUpdating(true);
    try {
      const isFloorplan = design.metadata?.category === "floorplan";
      
      // Prepare updated metadata based on category
      const updatedMetadata = {
        ...design.metadata,
        ...(isFloorplan 
          ? { rooms, squareFeet } 
          : { designType })
      };
      
      const success = await onUpdate(design.id, {
        title,
        metadata: updatedMetadata
      });
      
      if (success) {
        setIsEditing(false);
        toast({
          title: "Design Updated",
          description: "Your changes have been saved successfully",
        });
      }
    } catch (error) {
      console.error("Error updating design:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating your design",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!design) return null;

  const isFloorplan = design.metadata?.category === "floorplan";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {isEditing ? "Edit Design" : design.title}
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative pb-[66%] bg-gray-100 rounded-md overflow-hidden">
            <img
              src={design.image_url}
              alt={design.title}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              
              {isFloorplan ? (
                <>
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <Select 
                      value={rooms.toString()} 
                      onValueChange={(value) => setRooms(Number(value))}
                    >
                      <SelectTrigger id="rooms">
                        <SelectValue placeholder="Select number of rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Room</SelectItem>
                        <SelectItem value="2">2 Rooms</SelectItem>
                        <SelectItem value="3">3 Rooms</SelectItem>
                        <SelectItem value="4">4 Rooms</SelectItem>
                        <SelectItem value="5">5+ Rooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input 
                      id="squareFeet" 
                      type="number" 
                      min={100}
                      max={20000}
                      value={squareFeet} 
                      onChange={(e) => setSquareFeet(Number(e.target.value))} 
                    />
                  </div>
                </>
              ) : (
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="designType">Design Style</Label>
                  <Select 
                    value={designType} 
                    onValueChange={(value) => setDesignType(value)}
                  >
                    <SelectTrigger id="designType">
                      <SelectValue placeholder="Select design style" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESIGN_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p>{isFloorplan ? "Floor Plan" : "Design Inspiration"}</p>
              </div>
              
              {isFloorplan ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number of Rooms</p>
                    <p>{design.metadata?.rooms} {parseInt(design.metadata?.rooms) === 1 ? 'Room' : 'Rooms'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Square Feet</p>
                    <p>{design.metadata?.squareFeet} sq ft</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Design Style</p>
                  <p>{design.metadata?.designType?.charAt(0).toUpperCase()}{design.metadata?.designType?.slice(1)}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
                <p>{new Date(design.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {isEditing ? (
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DesignDetailDialog;
