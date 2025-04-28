import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Design, DESIGN_TYPES } from "@/types/design";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DesignDetailDialogProps {
  design: Design;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Design>) => Promise<boolean>;
}

const DesignDetailDialog = ({
  design,
  isOpen,
  onClose,
  onUpdate
}: DesignDetailDialogProps) => {
  const [formData, setFormData] = useState({
    title: design.title,
    rooms: design.rooms,
    designType: design.style
  });
  const { toast } = useToast();

  const isFloorplan = design.metadata?.category === "floorplan";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Partial<Design> = {
      title: formData.title,
      metadata: {
        ...design.metadata,
        rooms: formData.rooms,
        designType: formData.designType
      }
    };

    const success = await onUpdate(design.id, updates);
    if (success) {
      toast({
        title: "Design Updated",
        description: "The design details have been updated successfully.",
      });
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update the design details. Please try again.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Design Details</DialogTitle>
          <DialogDescription>
            Make changes to your design details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          {isFloorplan ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="rooms">Number of Rooms</Label>
                <Select
                  name="rooms"
                  value={String(formData.rooms || "")}
                  onValueChange={(value) => setFormData({ ...formData, rooms: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of rooms" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>{num} Rooms</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="designType">Design Type</Label>
              <Select
                name="designType"
                value={formData.designType || ""}
                onValueChange={(value) => setFormData({ ...formData, designType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select design type" />
                </SelectTrigger>
                <SelectContent>
                  {DESIGN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DesignDetailDialog;
