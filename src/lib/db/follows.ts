import { and, eq, sql } from "drizzle-orm";

import { db as database } from "./client";
import { follows } from "./schema.postgres";

/**
 * Follow a profile (Watch)
 * Resolves follower profile from User ID
 * @param userId
 * @param followedProfileId
 * @param status
 */
export const followProfile = async (
  userId: string,
  followedProfileId: string,
  status: "watch" | "follow" = "follow"
) => {
  // Get follower profile ID from User ID
  const followerProfile = await database.query.userProfiles.findFirst({
    where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
    columns: { id: true },
  });

  if (!followerProfile) throw new Error("Follower profile not found");

  const newFollow = {
    followerProfileId: followerProfile.id,
    followedProfileId: followedProfileId,
    status: status,
  };

  // Drizzle ORM type inference
  const [inserted] = await database
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
 * @param userId
 * @param followedProfileId
 */
export const unfollowProfile = async (
  userId: string,
  followedProfileId: string
) => {
  // Get follower profile ID
  const followerProfile = await database.query.userProfiles.findFirst({
    where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
    columns: { id: true },
  });

  if (!followerProfile) throw new Error("Follower profile not found");

  const [deleted] = await database
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
