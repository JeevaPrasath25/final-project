
export type DesignCategory = "floorplan" | "inspiration";

export type DesignMetadata = {
  category?: DesignCategory;
  rooms?: number | string;
  squareFeet?: number | string;
  designType?: string;
};

export interface Design {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
  user_id: string;
  style?: string;
  rooms?: number;
  size?: number;
  date?: string;
  description?: string;
  tags: string[];
  architect_name?: string;
  architect_id?: string;
  category?: string;
  metadata?: DesignMetadata;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  design_likes?: { count: number };
  design_saves?: { count: number };
}

export interface DesignFormData {
  title: string;
  category: DesignCategory;
  metadata: {
    rooms?: number;
    squareFeet?: number;
    designType?: string;
  };
}

export const DESIGN_TYPES = [
  "modern",
  "contemporary",
  "traditional",
  "minimalist",
  "industrial",
  "scandinavian",
  "mid-century",
  "bohemian",
  "farmhouse",
  "coastal",
  "mediterranean"
];
