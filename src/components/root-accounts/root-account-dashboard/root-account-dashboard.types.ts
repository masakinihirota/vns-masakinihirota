"use client";

export type FileStatusEnum = "active" | "suspended" | "archived";

export interface Language {
  id: string;
  name: string;
  native_name: string;
}

export interface RootAccount {
  id: string;
  display_id: string;
  display_name: string;
  statement: string;
  mother_tongue_codes: string[];
  available_language_codes: string[];
  // Basic Attributes
  location: string;
  activity_area_id?: number; // エリア選択用 (1, 2, 3...)
  birth_generation: string;
  activity_culture_code: string;
  zodiac_sign?: string; // 星座 (e.g., "牡羊座")
  core_hours_start: string;
  core_hours_end: string;
  core_hours_2_start?: string;
  core_hours_2_end?: string;
  uses_ai_translation: boolean;
  // Gamification & Trust
  level: number;
  total_points: number;
  // Point Management Extended
  auto_recovery_max_points: number;
  total_consumed_points: number;
  consumed_points_click: number;
  consumed_points_activity: number;
  daily_recovery_rate: number;
  last_recovery_at: string;
  trust_duration_days: number; // 初期30からスタート
  warning_count: number;
  status: FileStatusEnum;
  penalty_status: PenaltyStatus;
  awards: Award[];
  // Auth & Meta
  is_anonymous_initial_auth: boolean;
  is_sso_user: boolean;
  created_at: string;
  last_login_at: string;
}

export interface PenaltyStatus {
  total_penalties: number;
  yellow_cards: number;
  red_cards: number;
  drift_count: number;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  awarded_at: string;
  icon_type: "trophy" | "star" | "medal" | "crown";
}

export interface UserProfileSummary {
  id: string;
  display_name: string;
  purpose: string;
  role_type: "leader" | "member";
  is_active: boolean;
  avatar_url?: string;
}
