import { desc, eq } from "drizzle-orm";

import { db as database } from "./client";
import { nations } from "./schema.postgres";
import type { Nation, NewNation } from "./types";

type DatabaseNation = typeof nations.$inferSelect;
type InsertNation = typeof nations.$inferInsert;

// Mapper Helpers
/**
 *
 * @param n
 */
function mapToNationDomain(n: DatabaseNation): Nation {
  return {
    id: n.id,
    name: n.name,
    description: n.description,
    avatarUrl: n.avatarUrl,
    coverUrl: n.coverUrl,
    isOfficial: n.isOfficial,
    ownerUserId: n.ownerUserId,
    ownerGroupId: n.ownerGroupId,
    transactionFeeRate: n.transactionFeeRate,
    foundationFee: n.foundationFee,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export const getNations = async (limit = 20) => {
  const result = await database.query.nations.findMany({
    limit: limit,
    orderBy: [desc(nations.createdAt)],
  });
  return result.map(mapToNationDomain);
};

export const createNation = async (nationData: NewNation) => {
  const [newNation] = await database
    .insert(nations)
    .values(nationData)
    .returning();
  return mapToNationDomain(newNation);
};

export const getNationById = async (nationId: string) => {
  const nation = await database.query.nations.findFirst({
    where: eq(nations.id, nationId),
  });
  return nation ? mapToNationDomain(nation) : undefined;
};

export const updateNation = async (
  nationId: string,
  updateData: Partial<Nation>
) => {
  const drizzleUpdate: Partial<InsertNation> = {};
  if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
  if (updateData.description !== undefined)
    drizzleUpdate.description = updateData.description;
  if (updateData.avatarUrl !== undefined)
    drizzleUpdate.avatarUrl = updateData.avatarUrl;
  if (updateData.coverUrl !== undefined)
    drizzleUpdate.coverUrl = updateData.coverUrl;
  drizzleUpdate.updatedAt = new Date().toISOString();

  const [updated] = await database
    .update(nations)
    .set(drizzleUpdate)
    .where(eq(nations.id, nationId))
    .returning();
  return mapToNationDomain(updated);
};
