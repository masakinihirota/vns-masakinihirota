export type UserProfile = {
  id: string;
  root_account_id: string;
  display_name: string;
  purpose: string | null;
  role_type: string;
  is_active: boolean;
  last_interacted_record_id: string | null;
  created_at: string;
  updated_at: string;
  // New fields
  profile_format: "business_card" | "profile" | "full";
  role: "leader" | "member";
  purposes: string[] | null;
  profile_type: "self" | "interview" | "third_party" | "ideal" | "ai";
  avatar_url: string | null;
  external_links: Record<string, any> | null;
};

export type CreateProfileData = {
  display_name: string;
  // purpose is deprecated in favor of purposes array, but kept for compatibility if needed or mapped
  purpose?: string;
  role_type?: string;
  // New input fields
  profile_format?: "business_card" | "profile" | "full";
  role?: "leader" | "member";
  purposes?: string[];
  profile_type?: "self" | "interview" | "third_party" | "ideal" | "ai";
  avatar_url?: string;
  external_links?: Record<string, any>;
};
