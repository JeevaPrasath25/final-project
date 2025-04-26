export type DesignCategory = "floorplan" | "inspiration";
export type DesignType = 
  | "modern"
  | "minimalist"
  | "contemporary"
  | "traditional"
  | "industrial"
  | "mediterranean"
  | "scandinavian"
  | "farmhouse";

export const DESIGN_TYPES: DesignType[] = [
  "modern",
  "minimalist",
  "contemporary",
  "traditional",
  "industrial",
  "mediterranean",
  "scandinavian",
  "farmhouse"
];

export interface FloorPlanMetadata {
  rooms: number;
  squareFeet: number;
}

export interface InspirationMetadata {
  designType: DesignType;
}

export type DesignMetadata = FloorPlanMetadata | InspirationMetadata;

export interface DesignFormData {
  title: string;
  category: DesignCategory;
  metadata: DesignMetadata;
}
