"use client";

export interface UserProfile {
  title: string;
  type: string;
  description: string;
  active: boolean;
  badgeColor: string;
  limit?: boolean;
}

export interface Group {
  name: string;
  members: number;
}

export interface Alliance {
  name: string;
  description: string;
}

export interface AccountStatus {
  status: string;
  type: string;
  days: number;
  lastLogin: string;
}

export interface AccountSettings {
  tutorialDone: boolean;
  valuesAnswered: boolean;
  adsConsent: boolean;
  menuLevel: string;
}

export interface Warnings {
  count: number;
  resetCount: number;
  lastReset: string;
}

export interface OAuth {
  google: { connected: boolean; email: string };
  github: { connected: boolean; username: string };
  twitter: { connected: boolean };
  stats: { connected: number; disconnected: number };
}

export interface Language {
  native: string;
  available: string[];
}

export interface RegionArea {
  name: string;
  description: string;
  selected: boolean;
}

export interface Region {
  current: string;
  areas: RegionArea[];
}

export interface BasicInfo {
  language: Language;
  region: Region;
}

export interface RootAccountDashboardData {
  user: {
    id: string;
    name: string;
    avatar: string;
    profiles: UserProfile[];
  };
  groups: {
    managed: Group[];
    joined: Group[];
  };
  alliances: {
    leader: Alliance[];
    member: Alliance[];
  };
  accountStatus: AccountStatus;
  accountSettings: AccountSettings;
  warnings: Warnings;
  oauth: OAuth;
  basicInfo: BasicInfo;
}
