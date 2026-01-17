import React from "react";

export interface Step {
  id: number;
  label: string;
  desc: string;
}

export interface UserTypeOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export interface PurposeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface WorkItem {
  id: number;
  title: string;
  url: string;
}

export interface FavWorkItem {
  id: number;
  title: string;
  category: string;
  isBest: boolean;
  genres?: string[];
}

export interface WizardFormData {
  role: string;
  type: string;
  purposes: string[];
  customName: string; // 自由に設定可能な名前
  displayName: string; // 星座ネーム
  zodiac: string; // From root account
  nameSuggestions: string[]; // Current candidates
  ownWorks: WorkItem[];
  favWorks: FavWorkItem[];
  valuesAnswer: string; // Keeping for backward compat / text entry
  basicValues: Record<string, string>; // New structured answers
}
