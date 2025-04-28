
import { useState } from 'react';
import { uploadDesignImage, deleteDesignImage } from '@/integrations/supabase/storage-setup';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to upload images",
      });
      return null;
    }

    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select an image to upload",
      });
      return null;
    }

    try {
      setIsUploading(true);
      const imageUrl = await uploadDesignImage(file, user.id);
      
      if (!imageUrl) {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "Could not upload the image. Please try again.",
        });
        return null;
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An unexpected error occurred during upload.",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to delete images",
      });
      return false;
    }
    
    try {
      // Extract the file path from the URL
      const url = new URL(imagePath);
      const pathSegments = url.pathname.split('/');
      // The last two segments should be userId/filename
      const filePath = pathSegments.slice(-2).join('/');
      
      const success = await deleteDesignImage(filePath);
      
      if (!success) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Could not delete the image. Please try again.",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in deleteImage:", error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "An unexpected error occurred during deletion.",
      });
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading
  };
};
