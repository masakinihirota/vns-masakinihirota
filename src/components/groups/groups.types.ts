export type RatingTier = "T1" | "T2" | "T3" | "NFM" | "unrated";

export interface Work {
  id: number;
  title: string;
  tiers: {
    t1: number;
    t2: number;
    t3: number;
    nfm: number;
    unrated: number;
  };
}

export interface ValueTopic {
  id: string;
  title: string;
  description: string;
  options: string[];
  category: string;
}

export interface ValueSelection {
  choice: string;
  tier: string; // 'T1' | 'T2' | 'T3'
  lastUpdated?: string;
}

export interface Member {
  id: string;
  name: string;
  role: "リーダー" | "メディエーター" | "一般";
  avatar: string;
  traits: string[];
  ratings: Record<number, RatingTier>;
  values: Record<string, ValueSelection>;
}

export type SortKey = "title" | "me" | "target";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// Sub-tabs types
export type PlazaTab = "chat" | "events";
export type EvalTab = "matrix" | "aggregation" | "detailed";
export type SkillTab = "mandala" | "list";
export type AdminTab = "members" | "projects";
