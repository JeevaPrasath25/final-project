
export const DESIGN_TYPES = [
  "modern",
  "traditional",
  "contemporary",
  "minimalist",
  "industrial",
  "scandinavian",
  "coastal",
  "farmhouse",
  "mediterranean",
  "mid-century"
];

export type DesignCategory = "floorplan" | "inspiration";

export interface DesignFormData {
  title: string;
  category: DesignCategory;
  metadata?: {
    rooms?: number;
    squareFeet?: number;
    designType?: string;
  };
}
