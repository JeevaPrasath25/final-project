
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

export interface Design {
  id: string;
  title: string;
  image_url: string;
  user_id: string;
  created_at: string;
  architect_id?: string;
  liked_by_user?: boolean;
  saved_by_user?: boolean;
  design_likes?: { count: number };
  design_saves?: { count: number };
  category?: DesignCategory;
  rooms?: number;
  size?: number;
  style?: string;
  date?: string;
  architect_name?: string;
  metadata?: {
    category: DesignCategory;
    designType?: string;
    rooms?: number;
    squareFeet?: number;
    [key: string]: any;
  };
}
