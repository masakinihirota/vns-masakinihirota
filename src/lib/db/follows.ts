import { and, eq, sql } from "drizzle-orm";
import { Tables } from "@/types/types_db";
import { db } from "./drizzle-postgres";
import { follows } from "./schema.postgres";

// Types
type Follow = Tables<"follows">;

/**
 * Follow a profile (Watch)
 * Resolves follower profile from User ID
 */
export const followProfile = async (
  userId: string,
  followedProfileId: string,
  status: "watch" | "follow" = "follow"
) => {
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
  const [inserted] = await db
    .insert(follows)
    .values(newFollow)
    .onConflictDoUpdate({
      target: [follows.followerProfileId, follows.followedProfileId],
      set: { status: status },
    })
    .returning();

  return inserted;
};

/**
 * Unfollow a profile
 */
export const unfollowProfile = async (
  userId: string,
  followedProfileId: string
) => {
  // Get follower profile ID
  const followerProfile = await db.query.userProfiles.findFirst({
    where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
    columns: { id: true },
  });

  if (!followerProfile) throw new Error("Follower profile not found");

  const [deleted] = await db
    .delete(follows)
    .where(
      and(
        eq(follows.followerProfileId, followerProfile.id),
        eq(follows.followedProfileId, followedProfileId)
      )
    )
    .returning();
  return deleted;
};
