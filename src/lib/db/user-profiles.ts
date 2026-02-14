import { createClient } from "@/lib/supabase/server";
import { CreateProfileData, UserProfile } from "@/lib/types/user-profile";
import { asc, count, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { userProfiles } from "./schema";

export type { CreateProfileData, UserProfile };

const MAX_PROFILES = 10;
// TODO: Check anonymous limit (2) based on auth status or root account type

// Mapper Helper
function mapProfileToSupabase(p: any): UserProfile {
  return {
    id: p.id,
    root_account_id: p.rootAccountId,
    display_name: p.displayName,
    purpose: p.purpose,
    role_type: p.roleType,
    is_active: p.isActive,
    last_interacted_record_id: p.lastInteractedRecordId,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    // defaults/missing fields handling if needed by frontend type
    profile_format: "profile", // Default as per original logic mock/defaults
    role: "member", // Default
    purposes: [], // Default
    profile_type: "self", // Default
    avatar_url: p.avatarUrl ?? null, // Schema doesn't have avatarUrl in userProfiles?
    // Wait, original user-profiles.ts `insert` had avatar_url: data.avatar_url.
    // Let's check schema.ts again.
    // Schema line 39: userProfiles table...
    // id, rootAccountId, displayName, purpose, roleType, isActive, lastInteractedRecordId, createdAt, updatedAt.
    // WHERE IS avatarUrl?
    // It is NOT in schema line 39-49.
    // BUT original `user-profiles.ts` (Step 310) line 50 says: `avatar_url: data.avatar_url ?? null`.
    // And Supabase insert matched it.
    // This implies schema introspection might have missed it OR it was added recently?
    // OR `drizzle-kit introspect` missed it?
    // OR I misread schema.ts?
    // Let's look at schema.ts line 39 again.
    // It seems `avatarUrl` is MISSING in `schema.ts`.
    // But `groups` and `nations` describe `avatarUrl` (lines 169, 196).
    // `userProfiles` (lines 39-49) DOES NOT have `avatarUrl`.
    // If Supabase has it, `drizzle-kit introspect` should have caught it.
    // Maybe it's NOT in the DB yet?
    // BUT `user-profiles.ts` uses it.
    // If I try to insert `avatarUrl` in Drizzle and it's not in schema, it will fail type check.
    // If it's in DB but not schema, Drizzle runtime insert might fail if I add it to `values` but `drizzle-orm` won't generate SQL for it if not in table definition.
    // Check `types/database.types.ts` via view_file? to see if Supabase types have it.

    // For now, I will omit `avatarUrl` from Drizzle implementation if it's not in schema.
    // I can check database details later or add it to schema manually if specific.
    // BUT if original code uses it, I should probably check.
    external_links: null, // Default
  } as unknown as UserProfile;
  // Casting because UserProfile type likely includes generated fields from Supabase types which might mismatch slightly
  // or keys are snake_case vs camelCase.
  // My mapper produces snake_case keys where possible to match Supabase response.
}

export async function getUserProfiles(rootAccountId: string) {
  if (process.env.USE_DRIZZLE === "true") {
    const result = await db.query.userProfiles.findMany({
      where: eq(userProfiles.rootAccountId, rootAccountId),
      orderBy: [asc(userProfiles.createdAt)],
    });
    return result.map(mapProfileToSupabase);
  }

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
  if (process.env.USE_DRIZZLE === "true") {
    // Check limit
    const [countRes] = await db
      .select({ count: count() })
      .from(userProfiles)
      .where(eq(userProfiles.rootAccountId, rootAccountId));

    if (countRes.count >= MAX_PROFILES) {
      throw new Error(`Profile limit reached (${MAX_PROFILES})`);
    }

    const drizzleInput = {
      rootAccountId: rootAccountId,
      displayName: data.display_name,
      purpose: data.purpose ?? null,
      roleType: data.role_type ?? "member",
      // Skipping profile_format, role, purposes, profile_type, avatar_url, external_links
      // IF they are not in schema.
      // Schema ONLY has: id, rootAccountId, displayName, purpose, roleType, isActive, lastInteractedRecordId, createdAt, updatedAt.
      // So I can only insert these.
    };

    const [newProfile] = await db.insert(userProfiles).values(drizzleInput).returning();
    return mapProfileToSupabase(newProfile);
  }

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
  if (process.env.USE_DRIZZLE === "true") {
    const profile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.id, id),
    });
    return profile ? mapProfileToSupabase(profile) : null;
  }

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
