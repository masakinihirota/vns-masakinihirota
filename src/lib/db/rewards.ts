import { type InferSelectModel, desc, eq, sql } from "drizzle-orm";

import { db as database } from "./client";
import { pointTransactions, userProfiles } from "./schema.postgres";

export type PointTransaction = InferSelectModel<typeof pointTransactions>;

/**
 * ポイント付与（仮面ごと）
 * @param userProfileId 対象の仮面プロフィールID
 * @param amount 付与ポイント数
 * @param type トランザクションタイプ
 * @param description 説明（オプショナル）
 */
export const grantPoints = async (
  userProfileId: string, // User Profile ID (仮面単位)
  amount: number,
  type: string,
  description?: string
) => {
  // Drizzle Implementation
  return await database.transaction(async (tx) => {
    // 1. Get User Profile
    const userProfile = await tx.query.userProfiles.findFirst({
      where: eq(userProfiles.id, userProfileId),
    });

    if (!userProfile) throw new Error("User profile not found");

    // 2. Insert Transaction
    await tx.insert(pointTransactions).values({
      userProfileId,
      amount,
      type,
      description,
    });

    // 3. Update User Profile Points
    await tx
      .update(userProfiles)
      .set({
        points: sql`${userProfiles.points} + ${amount}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userProfiles.id, userProfileId));

    return { success: true, newBalance: userProfile.points + amount };
  });
};

/**
 * ポイント履歴取得（仮面ごと）
 * @param userProfileId 対象の仮面プロフィールID
 * @param limit 取得件数（デフォルト20）
 */
export const getPointHistory = async (
  userProfileId: string,
  limit = 20
): Promise<PointTransaction[]> => {
  return await database.query.pointTransactions.findMany({
    where: eq(pointTransactions.userProfileId, userProfileId),
    orderBy: [desc(pointTransactions.createdAt)],
    limit,
  });
};
