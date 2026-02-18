import { type InferSelectModel, desc, eq, sql } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { pointTransactions, rootAccounts } from "./schema.postgres";

export type PointTransaction = InferSelectModel<typeof pointTransactions>;

export const grantPoints = async (
  userId: string, // Auth User ID
  amount: number,
  type: string,
  description?: string
) => {
  // Drizzle Implementation
  return await db.transaction(async (tx) => {
    // 1. Get Root Account
    const rootAccount = await tx.query.rootAccounts.findFirst({
      where: eq(rootAccounts.authUserId, userId),
    });

    if (!rootAccount) throw new Error("Root account not found");

    // 2. Insert Transaction
    await tx.insert(pointTransactions).values({
      rootAccountId: rootAccount.id,
      amount,
      type,
      description,
    });

    // 3. Update Root Account Points
    await tx
      .update(rootAccounts)
      .set({
        points: sql`${rootAccounts.points} + ${amount}`,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(rootAccounts.id, rootAccount.id));

    return { success: true, newBalance: rootAccount.points + amount };
  });
};

export const getPointHistory = async (
  userId: string,
  limit = 20
): Promise<PointTransaction[]> => {
  const rootAccount = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.authUserId, userId),
  });

  if (!rootAccount) return [];

  return await db.query.pointTransactions.findMany({
    where: eq(pointTransactions.rootAccountId, rootAccount.id),
    orderBy: [desc(pointTransactions.createdAt)],
    limit,
  });
};
