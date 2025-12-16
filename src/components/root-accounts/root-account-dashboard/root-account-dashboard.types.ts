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
  mother_tongue_code: string;
  site_language_code: string;
  location: string;
  birth_generation: string;
  level: number;
  total_points: number;
  warning_count: number;
  status: FileStatusEnum;
  is_anonymous_initial_auth: boolean;
  is_sso_user: boolean;
  created_at: string;
  last_login_at: string;
}
