import type { Tables, TablesInsert, TablesUpdate } from "@/types/types_db";
import { desc, eq } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { nations } from "./schema.postgres";

type Nation = Tables<"nations">;
type NationInsert = TablesInsert<"nations">;
type NationUpdate = TablesUpdate<"nations">;

// Mapper Helpers
function mapNationToSupabase(n: any): Nation {
  return {
    id: n.id,
    name: n.name,
    description: n.description,
    avatar_url: n.avatarUrl,
    cover_url: n.coverUrl,
    is_official: n.isOfficial,
    owner_user_id: n.ownerUserId,
    owner_group_id: n.ownerGroupId,
    transaction_fee_rate: n.transactionFeeRate,
    foundation_fee: n.foundationFee,
    created_at: n.createdAt,
    updated_at: n.updatedAt,
  };
}

export const getNations = async (limit = 20) => {
  const result = await db.query.nations.findMany({
    limit: limit,
    orderBy: [desc(nations.createdAt)],
  });
  return result.map(mapNationToSupabase);
};

export const createNation = async (nationData: NationInsert) => {
  const drizzleInput = {
    name: nationData.name,
    description: nationData.description,
    avatarUrl: nationData.avatar_url,
    coverUrl: nationData.cover_url,
    isOfficial: nationData.is_official,
    ownerUserId: nationData.owner_user_id,
    ownerGroupId: nationData.owner_group_id,
    transactionFeeRate: nationData.transaction_fee_rate,
    foundationFee: nationData.foundation_fee,
  };

  // Note: RPC create_nation might handle more than just insert?
  // Usually it creates the nation and sets the owner.
  // It might also create a default group?
  // For now, simple insert, as schema has Owner User ID.
  // If specific RPC logic exists (e.g. creating a 'nation group'), we might need to verify.
  // But based on available info, we'll do simple insert first.

  // @ts-expect-error
  const [newNation] = await db.insert(nations).values(drizzleInput).returning();
  return mapNationToSupabase(newNation);
};

export const getNationById = async (nationId: string) => {
  const nation = await db.query.nations.findFirst({
    where: eq(nations.id, nationId),
  });
  return nation ? mapNationToSupabase(nation) : null;
};

export const updateNation = async (
  nationId: string,
  updateData: NationUpdate
) => {
  const drizzleUpdate: any = {};
  if (updateData.name !== undefined) drizzleUpdate.name = updateData.name;
  if (updateData.description !== undefined) drizzleUpdate.description = updateData.description;
  if (updateData.avatar_url !== undefined) drizzleUpdate.avatarUrl = updateData.avatar_url;
  if (updateData.cover_url !== undefined) drizzleUpdate.coverUrl = updateData.cover_url;
  // add other fields as needed

  const [updated] = await db.update(nations).set(drizzleUpdate).where(eq(nations.id, nationId)).returning();
  return mapNationToSupabase(updated);
};
