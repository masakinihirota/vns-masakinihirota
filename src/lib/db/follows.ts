import { Database, Tables } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { and, eq, sql } from "drizzle-orm";
import { db } from "./drizzle";
import { follows } from "./schema";

// Types
type Follow = Tables<"follows">;

/**
 * Follow a profile (Watch)
 * Resolves follower profile from User ID
 */
export const followProfile = async (
  supabase: SupabaseClient<Database> | null,
  userId: string,
  followedProfileId: string,
  status: "watch" | "follow" = "follow"
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // Get follower profile ID from User ID
    const followerProfile = await db.query.userProfiles.findFirst({
      where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
      columns: { id: true },
    });

    if (!followerProfile) throw new Error("Follower profile not found");

    const newFollow = {
      followerProfileId: followerProfile.id,
      followedProfileId: followedProfileId,
      status: status,
    };

    // @ts-ignore
    const [inserted] = await db.insert(follows).values(newFollow).onConflictDoUpdate({
      target: [follows.followerProfileId, follows.followedProfileId],
      set: { status: status }
    }).returning();

    return inserted;
  }

  if (!supabase) throw new Error("Supabase client required");

  // Get follower profile ID
  const { data: rootAccount } = await supabase.from("root_accounts").select("id").eq("auth_user_id", userId).single();
  const { data: followerProfile } = await supabase.from("user_profiles").select("id").eq("root_account_id", rootAccount!.id).single();

  if (!followerProfile) throw new Error("Follower profile not found");

  const { data, error } = await supabase
    .from("follows")
    .upsert({
      follower_profile_id: followerProfile.id,
      followed_profile_id: followedProfileId,
      status: status,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Unfollow a profile
 */
export const unfollowProfile = async (
  supabase: SupabaseClient<Database> | null,
  userId: string,
  followedProfileId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // Get follower profile ID
    const followerProfile = await db.query.userProfiles.findFirst({
      where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
      columns: { id: true },
    });

    if (!followerProfile) throw new Error("Follower profile not found");

    const [deleted] = await db.delete(follows)
      .where(and(
        eq(follows.followerProfileId, followerProfile.id),
        eq(follows.followedProfileId, followedProfileId)
      ))
      .returning();
    return deleted;
  }

  if (!supabase) throw new Error("Supabase client required");

  // Get follower profile ID
  const { data: rootAccount } = await supabase.from("root_accounts").select("id").eq("auth_user_id", userId).single();
  const { data: followerProfile } = await supabase.from("user_profiles").select("id").eq("root_account_id", rootAccount!.id).single();

  if (!followerProfile) throw new Error("Follower profile not found");

  const { data, error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_profile_id", followerProfile.id)
    .eq("followed_profile_id", followedProfileId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
