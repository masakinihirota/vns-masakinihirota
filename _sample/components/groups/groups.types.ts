export type RatingTier = "T1" | "T2" | "T3" | "NFM" | "unrated";

// UI / Legacy compatibility types - preferably move towards using Drizzle types directly
import { Event as DatabaseEvent, Group as DatabaseGroup, MarketItem as DatabaseMarketItem, Nation as DatabaseNation, Notification as DatabaseNotification } from "@/lib/db/types";

export interface Work {
  id: string; // Changed from number to string to match DB
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
  ratings: Record<string, RatingTier>; // Key changed to string for work ID
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

// Aliases to Drizzle types for compatibility with existing code
export type Group = DatabaseGroup;
export type MarketItem = DatabaseMarketItem;
export type Nation = DatabaseNation;
export type NationEvent = DatabaseEvent;
export type Notification = DatabaseNotification;

// Legacy insert types (placeholders if needed)
export type GroupMember = any;
export type NationGroup = any;
export type NationCitizen = any;
