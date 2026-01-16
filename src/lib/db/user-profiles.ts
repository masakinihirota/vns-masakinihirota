import { createClient } from "@/lib/supabase/server";

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

const MAX_PROFILES = 10;
// TODO: Check anonymous limit (2) based on auth status or root account type

export async function getUserProfiles(rootAccountId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("root_account_id", rootAccountId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching user profiles:", error);
    throw new Error("Failed to fetch profiles");
  }

  return data as UserProfile[];
}

export async function createUserProfile(
  rootAccountId: string,
  data: CreateProfileData
) {
  const supabase = await createClient();

  // Check limit
  const currentProfiles = await getUserProfiles(rootAccountId);
  if (currentProfiles.length >= MAX_PROFILES) {
    throw new Error(`Profile limit reached (${MAX_PROFILES})`);
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .insert({
      root_account_id: rootAccountId,
      display_name: data.display_name,
      purpose: data.purpose ?? null, // Legacy field, maybe sync with purposes[0]
      role_type: data.role_type ?? "member",
      // New fields with defaults
      profile_format: data.profile_format ?? "profile",
      role: data.role ?? "member",
      purposes: data.purposes ?? [],
      profile_type: data.profile_type ?? "self",
      avatar_url: data.avatar_url ?? null,
      external_links: data.external_links ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create profile");
  }

  return profile as UserProfile;
}

export async function getUserProfileById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile");
  }

  return data as UserProfile;
}
