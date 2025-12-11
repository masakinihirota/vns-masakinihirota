import { createClient } from "@/lib/supabase/server";
// import { getRootAccount } from "./root-accounts";

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
};

export type CreateProfileData = {
  display_name: string;
  purpose?: string;
  role_type?: string;
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

export async function createUserProfile(rootAccountId: string, data: CreateProfileData) {
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
      purpose: data.purpose ?? null,
      role_type: data.role_type ?? "member",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw new Error("Failed to create profile");
  }

  return profile as UserProfile;
}
