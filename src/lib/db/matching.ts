import { sql } from "drizzle-orm";

import { db as database } from "./client";
import { alliances, userProfiles } from "./schema.postgres";

/**
 * Get matching candidates for a user
 * Returning profiles that are NOT already applied/matched
 * ✅ Optimized: Single query instead of 3 separate N+1 queries
 * @param userId
 * @param limit
 */
export const getMatchingCandidates = async (userId: string, limit = 10) => {
  const candidates = await database.query.userProfiles.findMany({
    where: sql`
      id NOT IN (
        SELECT id FROM ${userProfiles}
        WHERE root_account_id IN (
          SELECT id FROM root_accounts WHERE auth_user_id = ${userId}
        )
        UNION ALL
        SELECT profile_a_id FROM ${alliances}
        WHERE profile_b_id IN (
          SELECT id FROM ${userProfiles}
          WHERE root_account_id IN (
            SELECT id FROM root_accounts WHERE auth_user_id = ${userId}
          )
        )
        UNION ALL
        SELECT profile_b_id FROM ${alliances}
        WHERE profile_a_id IN (
          SELECT id FROM ${userProfiles}
          WHERE root_account_id IN (
            SELECT id FROM root_accounts WHERE auth_user_id = ${userId}
          )
        )
      )
    `,
    limit,
    orderBy: (table, { desc }) => [desc(table.updatedAt)],
  });

  return candidates;
};

/**
 * Create a matching request (Alliance Request)
 * @param userId
 * @param targetProfileId
 */
export const createMatchingRequest = async (
  userId: string,
  targetProfileId: string
) => {
  // 1. Get current user's profile ID
  const currentProfile = await database.query.userProfiles.findFirst({
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

  const [inserted] = await database.insert(alliances).values(newAlliance).returning();
  return inserted;
};
