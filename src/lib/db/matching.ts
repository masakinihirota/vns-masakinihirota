import { Database, Tables } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { notInArray, sql } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { alliances, userProfiles } from "./schema.postgres";

// Types
type Profile = Tables<"user_profiles">;
type Alliance = Tables<"alliances">;

/**
 * Get matching candidates for a user
 * Returning profiles that are NOT already applied/matched
 */
export const getMatchingCandidates = async (
  supabase: SupabaseClient<Database> | null,
  userId: string,
  limit = 10
) => {
  if (true) {
    // 1. Get current user's profile ID
    const currentProfile = await db.query.userProfiles.findFirst({
      where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
      columns: { id: true },
    });

    if (!currentProfile) return [];

    // 2. Get IDs of profiles already interacted with (A or B side of alliance)
    const existingAlliances = await db.query.alliances.findMany({
      where: sql`profile_a_id = ${currentProfile.id} OR profile_b_id = ${currentProfile.id}`,
      columns: { profileAId: true, profileBId: true },
    });

    const excludedIds = new Set<string>([currentProfile.id]);
    existingAlliances.forEach((a) => {
      excludedIds.add(a.profileAId);
      excludedIds.add(a.profileBId);
    });

    // 3. Find candidates not in excluded list
    const candidates = await db.query.userProfiles.findMany({
      where: notInArray(userProfiles.id, Array.from(excludedIds)),
      limit,
      // Simple random-ish sort or just latest for MVP
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
    });

    // Map to include some compatibility score mock if needed?
    // For now returning raw profiles
    return candidates;
  }

  // Supabase Implementation
  if (!supabase) throw new Error("Supabase client required");

  // 1. Get current user's profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("root_account_id", (await supabase.from("root_accounts").select("id").eq("auth_user_id", userId).single()).data?.id!)
    .single();

  if (!profile) return [];

  // 2. Get existing interactions
  const { data: interactions } = await supabase
    .from("alliances")
    .select("profile_a_id, profile_b_id")
    .or(`profile_a_id.eq.${profile.id},profile_b_id.eq.${profile.id}`);

  const excludedIds = [profile.id];
  interactions?.forEach((i) => {
    excludedIds.push(i.profile_a_id);
    excludedIds.push(i.profile_b_id);
  });

  // 3. Get candidates
  const { data: candidates } = await supabase
    .from("user_profiles")
    .select("*")
    .not("id", "in", `(${excludedIds.join(",")})`)
    .limit(limit);

  return candidates || [];
};

/**
 * Create a matching request (Alliance Request)
 */
export const createMatchingRequest = async (
  supabase: SupabaseClient<Database> | null,
  userId: string,
  targetProfileId: string
) => {
  if (true) {
    // 1. Get current user's profile ID
    const currentProfile = await db.query.userProfiles.findFirst({
      where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
      columns: { id: true },
    });

    if (!currentProfile) throw new Error("Profile not found");

    // Sort IDs to ensure A < B constraint if enforced, or just use as is
    // Schema constraint: check("alliances_profile_order_check", sql`profile_a_id < profile_b_id`)
    // We must respect this constraint.
    const [id1, id2] = [currentProfile.id, targetProfileId].sort();

    const newAlliance = {
      profileAId: id1,
      profileBId: id2,
      status: "requested" as const,
      // If the requester is A, status is requested.
      // If requester is B ... wait, 'requested' usually implies direction.
      // But the constraint forces order.
      // We might need metadata to know WHO requested it if we enforce id sort.
      metadata: {
        requestedBy: currentProfile.id
      }
    };

    // @ts-ignore
    const [inserted] = await db.insert(alliances).values(newAlliance).returning();
    return inserted;
  }

  if (!supabase) throw new Error("Supabase client required");

  // Get profile id first
  const { data: rootAccount } = await supabase.from("root_accounts").select("id").eq("auth_user_id", userId).single();
  const { data: profile } = await supabase.from("user_profiles").select("id").eq("root_account_id", rootAccount!.id).single();

  if (!profile) throw new Error("Profile not found");

  const [id1, id2] = [profile.id, targetProfileId].sort();

  const { data, error } = await supabase.from("alliances").insert({
    profile_a_id: id1,
    profile_b_id: id2,
    status: "requested",
    metadata: { requestedBy: profile.id }
  }).select().single();

  if (error) throw error;
  return data;
};
