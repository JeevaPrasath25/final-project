
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DesignGrid from "@/components/designs/DesignGrid";
import DesignUploadForm from "@/components/designs/DesignUploadForm";
import { Design } from "@/types/design";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

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
  updateDesign: (id: string, updates: Partial<Design>) => Promise<boolean>;
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
  deleteDesign,
  updateDesign
}: ArchitectDesignsProps) => {
  const { user } = useAuth();
  const [myDesigns, setMyDesigns] = useState<Design[]>([]);
  const [uploadedDesigns, setUploadedDesigns] = useState<Design[]>([]);
  const [floorplans, setFloorplans] = useState<Design[]>([]);
  const [inspirations, setInspirations] = useState<Design[]>([]);
  
  useEffect(() => {
    if (user && designs) {
      // Filter designs for "My Designs" (saved and liked)
      const filteredDesigns = designs.filter(design => 
        design.architect_id === user.id || design.user_id === user.id
      );
      setMyDesigns(filteredDesigns);
      
      // Filter designs for "Uploaded Designs" (only those uploaded by the architect)
      const uploaded = designs.filter(design => design.user_id === user.id);
      setUploadedDesigns(uploaded);
      
      // Further filter by category
      setFloorplans(filteredDesigns.filter(design => 
        design.metadata?.category === "floorplan"
      ));
      
      setInspirations(filteredDesigns.filter(design => 
        design.metadata?.category === "inspiration"
      ));
    }
  }, [designs, user]);

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Designs</TabsTrigger>
        <TabsTrigger value="uploaded">My Uploaded Designs</TabsTrigger>
        <TabsTrigger value="floorplans">Floor Plans</TabsTrigger>
        <TabsTrigger value="inspirations">Design Inspirations</TabsTrigger>
        <TabsTrigger value="upload">Upload New Design</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-6">
        <DesignGrid
          designs={myDesigns}
          onLike={toggleLikeDesign}
          onSave={toggleSaveDesign}
          onDeleteDesign={deleteDesign}
          onUpdateDesign={updateDesign}
          onUploadClick={() => {
            const uploadTab = document.querySelector('[data-state="inactive"][value="upload"]') as HTMLButtonElement;
            uploadTab?.click();
          }}
        />
      </TabsContent>

      <TabsContent value="uploaded" className="space-y-6">
        <DesignGrid
          designs={uploadedDesigns}
          onLike={toggleLikeDesign}
          onSave={toggleSaveDesign}
          onDeleteDesign={deleteDesign}
          onUpdateDesign={updateDesign}
          onUploadClick={() => {
            const uploadTab = document.querySelector('[data-state="inactive"][value="upload"]') as HTMLButtonElement;
            uploadTab?.click();
          }}
        />
      </TabsContent>
      
      <TabsContent value="floorplans" className="space-y-6">
        <DesignGrid
          designs={floorplans}
          onLike={toggleLikeDesign}
          onSave={toggleSaveDesign}
          onDeleteDesign={deleteDesign}
          onUpdateDesign={updateDesign}
          onUploadClick={() => {
            const uploadTab = document.querySelector('[data-state="inactive"][value="upload"]') as HTMLButtonElement;
            uploadTab?.click();
          }}
        />
      </TabsContent>
      
      <TabsContent value="inspirations" className="space-y-6">
        <DesignGrid
          designs={inspirations}
          onLike={toggleLikeDesign}
          onSave={toggleSaveDesign}
          onDeleteDesign={deleteDesign}
          onUpdateDesign={updateDesign}
          onUploadClick={() => {
            const uploadTab = document.querySelector('[data-state="inactive"][value="upload"]') as HTMLButtonElement;
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
