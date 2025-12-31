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
  birth_generation: string;
  activity_culture_code: string;
  core_hours_start: string;
  core_hours_end: string;
  uses_ai_translation: boolean;
  // Gamification & Trust
  level: number;
  total_points: number;
  trust_duration_days: number; // 初期30からスタート
  warning_count: number;
  status: FileStatusEnum;
  // Auth & Meta
  is_anonymous_initial_auth: boolean;
  is_sso_user: boolean;
  created_at: string;
  last_login_at: string;
}

export interface UserProfileSummary {
  id: string;
  display_name: string;
  purpose: string;
  role_type: "leader" | "member";
  is_active: boolean;
  avatar_url?: string;
}
