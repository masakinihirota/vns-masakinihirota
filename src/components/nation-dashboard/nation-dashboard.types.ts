import { LucideIcon } from "lucide-react";

export type TabId = "gate" | "plaza" | "market" | "bank" | "castle";

export interface TabConfig {
  id: TabId;
  label: string;
  icon: LucideIcon;
  desc: string;
}

export interface NationData {
  id: string;
  name: string;
  level: string;
  population: number;
  activePopulation: number;
  taxRate: number;
  treasury: number;
  maintenanceCost: number;
  description: string;
  leader: string;
  climate: string;
  nextDeduction: string;
}

export interface MarketItem {
  id: number;
  name: string;
  price: number;
  seller: string;
  category: "必需品" | "ツール" | "知識" | "消耗品";
  desc: string;
}

export interface BoardPost {
  id: number;
  user: string;
  role: "King" | "Ghost" | "Citizen";
  content: string;
  time: string;
  likes: number;
}
