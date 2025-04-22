
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesignGrid from "@/components/designs/DesignGrid";
import DesignUploadForm from "@/components/designs/DesignUploadForm";
import { Design } from "@/hooks/useDesigns";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ArchitectDesignsProps {
  designs: Design[];
  designImage: File | null;
  uploadingDesign: boolean;
  setDesignImage: (file: File | null) => void;
  uploadDesign: (title: string, imageUrl: string) => Promise<boolean>;
  uploadDesignImage: () => Promise<string | null>;
  toggleLikeDesign: (id: string, liked: boolean) => void;
  toggleSaveDesign: (id: string, saved: boolean) => void;
  deleteDesign: (id: string) => void;
}

const ArchitectDesigns = ({
  designs,
  designImage,
  uploadingDesign,
  setDesignImage,
  uploadDesign,
  uploadDesignImage,
  toggleLikeDesign,
  toggleSaveDesign,
  deleteDesign
}: ArchitectDesignsProps) => {
  const { user } = useAuth();
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const tabsRef = useRef<{ value: string; trigger: React.RefObject<HTMLButtonElement> } | null>(null);
  
  useEffect(() => {
    // Filter designs to only show those created by the current user
    if (user && designs) {
      const filteredDesigns = designs.filter(design => 
        design.architect_id === user.id || design.user_id === user.id
      );
      setMyDesigns(filteredDesigns);
    }
  }, [designs, user]);

  return (
    <Tabs defaultValue="designs" className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="designs">My Designs</TabsTrigger>
        <TabsTrigger value="upload">Upload New Design</TabsTrigger>
      </TabsList>
      
      <TabsContent value="designs" className="space-y-6">
        <DesignGrid
          designs={myDesigns}
          onLike={toggleLikeDesign}
          onSave={toggleSaveDesign}
          onDeleteDesign={deleteDesign}
          onUploadClick={() => {
            // Programmatically switch to the upload tab
            const uploadTab = document.querySelector('[data-radix-tab-trigger][value="upload"]') as HTMLButtonElement;
            uploadTab?.click();
          }}
        />
      </TabsContent>
      
      <TabsContent value="upload">
        <DesignUploadForm
          designImage={designImage}
          uploadingDesign={uploadingDesign}
          setDesignImage={setDesignImage}
          uploadDesign={uploadDesign}
          uploadDesignImage={uploadDesignImage}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ArchitectDesigns;

