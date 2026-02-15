import { notInArray, sql } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { alliances, userProfiles } from "./schema.postgres";

/**
 * Get matching candidates for a user
 * Returning profiles that are NOT already applied/matched
 */
export const getMatchingCandidates = async (userId: string, limit = 10) => {
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

  return candidates;
};

/**
 * Create a matching request (Alliance Request)
 */
export const createMatchingRequest = async (
  userId: string,
  targetProfileId: string
) => {
  // 1. Get current user's profile ID
  const currentProfile = await db.query.userProfiles.findFirst({
    where: sql`root_account_id IN (SELECT id FROM root_accounts WHERE auth_user_id = ${userId})`,
    columns: { id: true },
  });

  if (!currentProfile) throw new Error("Profile not found");

  // Sort IDs to ensure A < B constraint if enforced
  const [id1, id2] = [currentProfile.id, targetProfileId].sort();

  const newAlliance = {
    profileAId: id1,
    profileBId: id2,
    status: "requested" as const,
    metadata: {
      requestedBy: currentProfile.id,
    },
  };

  const [inserted] = await db.insert(alliances).values(newAlliance).returning();
  return inserted;
};
