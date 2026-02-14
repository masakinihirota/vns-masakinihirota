import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle/client";
import { nations } from "@/lib/drizzle/schema";

/** Drizzle版: ネーション作成 */
export const createNationDrizzle = async (nationData: {
  name: string;
  description?: string;
  avatar_url?: string;
  cover_url?: string;
  owner_user_id: string;
  owner_group_id: string;
  transaction_fee_rate: number;
  foundation_fee: number;
}) => {
  const result = await db
    .insert(nations)
    .values({
      name: nationData.name,
      description: nationData.description,
      avatarUrl: nationData.avatar_url,
      coverUrl: nationData.cover_url,
      ownerUserId: nationData.owner_user_id,
      ownerGroupId: nationData.owner_group_id,
      transactionFeeRate: nationData.transaction_fee_rate,
      foundationFee: nationData.foundation_fee,
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to create nation");
  return result[0];
};

/** Drizzle版: ネーション取得 */
export const getNationByIdDrizzle = async (nationId: string) => {
  const rows = await db
    .select()
    .from(nations)
    .where(eq(nations.id, nationId))
    .limit(1);

  if (rows.length === 0) throw new Error("Nation not found");
  return rows[0];
};
