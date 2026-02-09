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

// --- Database Types (Temporary until generated) ---

export interface Group {
  id: string;
  name: string;
  description: string | null;
  is_official: boolean;
  avatar_url: string | null;
  cover_url: string | null;
  leader_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  group_id: string;
  user_profile_id: string;
  role: "leader" | "mediator" | "member";
  joined_at: string;
}

export interface Nation {
  id: string;
  name: string;
  description: string | null;
  is_official: boolean | null;
  avatar_url: string | null;
  cover_url: string | null;
  owner_user_id: string | null;
  owner_group_id: string | null;
  transaction_fee_rate: number | null;
  foundation_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface NationGroup {
  nation_id: string;
  group_id: string;
  role: "deputy" | "member";
  joined_at: string;
}

export interface NationCitizen {
  nation_id: string;
  user_profile_id: string;
  role: "official" | "citizen";
  joined_at: string;
}

export interface MarketItem {
  id: string;
  nation_id: string;
  seller_id: string | null;
  seller_group_id: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  type: "sell" | "buy_request";
  status: "open" | "sold" | "closed";
  created_at: string;
  updated_at: string;
}

export interface NationEvent {
  id: string;
  nation_id: string;
  organizer_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string;
  end_at: string | null;
  recruitment_start_at: string | null;
  recruitment_end_at: string | null;
  max_participants: number | null;
  conditions: string | null;
  sponsors: string | null;
  type: "product_required" | "free" | "other";
  status: "draft" | "published" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_profile_id: string;
  title: string;
  message: string;
  link_url: string | null;
  type: "system" | "invite" | "transaction" | "event";
  is_read: boolean;
  created_at: string;
}
