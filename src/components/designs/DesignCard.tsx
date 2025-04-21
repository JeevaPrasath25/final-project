
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Trash2 } from "lucide-react";
import { Design } from "@/hooks/useDesigns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface DesignCardProps {
  design: Design;
  onLike: (id: string, liked: boolean) => void;
  onSave: (id: string, saved: boolean) => void;
  onDelete?: (id: string) => void;
}

const DesignCard = ({ design, onLike, onSave, onDelete }: DesignCardProps) => {
  return (
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
  );
};

export default DesignCard;
