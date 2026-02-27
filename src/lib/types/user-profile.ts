export interface UserProfile {
  id: string;
  root_account_id: string;
  display_name: string;
  purpose?: string;
  role_type?: string;
  is_active: boolean;
  last_interacted_record_id?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  profile_format?: string;
  role?: string;
  purposes?: string[];
  profile_type?: string;
  avatar_url?: string | null;
  external_links?: Record<string, string> | null;
}

export interface CreateProfileData {
  id: string;
  root_account_id: string;
  display_name: string;
  purpose?: string;
  role_type?: string;
  is_active: boolean;
  last_interacted_record_id?: string | null;
  profile_format?: string;
  role?: string;
  purposes?: string[];
  profile_type?: string;
  avatar_url?: string | null;
  external_links?: Record<string, string> | null;
}
