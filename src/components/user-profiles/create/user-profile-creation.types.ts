import { ReactNode } from "react";

export interface Step {
  id: number;
  label: string;
  desc: string;
}

export interface MasterWork {
  id: number;
  title: string;
  category: string;
  author: string;
  tags: string[];
  era: string;
}

export type Period = "LIFE" | "NOW" | "FUTURE";

export interface FavWork extends MasterWork {
  period: Period;
  isBest: boolean;
  tier: 1 | 2 | 3 | "normal" | null;
}

export interface UserType {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: ReactNode;
  isSpecial?: boolean;
}

export interface Purpose {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface ValueQuestion {
  id: string;
  category: string;
  title: string;
  relatedPurposes: string[];
  tags: string[];
  choices: { id: string; label: string }[];
  infoBlocks: { title: string; url: string; comment: string }[];
  relatedIds: string[];
}
