
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

export const useProfileImage = (user: User | null) => {
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  const uploadProfileImage = async () => {
    if (!profileImage || !user) return null;

    setUploadingProfileImage(true);
    try {
      const fileExt = profileImage.name.split('.').pop();
      const filePath = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'profiles')) {
        await supabase.storage.createBucket('profiles', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, profileImage, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      toast({
        variant: "destructive",
        title: "Error uploading profile image",
        description: error.message,
      });
      return null;
    } finally {
      setUploadingProfileImage(false);
    }
  };

  return {
    profileImage,
    setProfileImage,
    uploadingProfileImage,
    uploadProfileImage
  };
};
