import { desc, eq, sql } from "drizzle-orm";
import { db } from "./drizzle";
import { pointTransactions, rootAccounts } from "./schema";

export const grantPoints = async (
  supabase: any, // Pass supabase client if using Supabase directly, or null if using Drizzle
  userId: string, // Auth User ID
  amount: number,
  type: string,
  description?: string
) => {
  // Drizzle Implementation
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  // Supabase Implementation
  if (!supabase) throw new Error("Supabase client required");

  // Use RPC for atomic transaction and security
  const { data, error } = await supabase.rpc("grant_points", {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
  });

  if (error) throw error;

  if (!data.success) {
    throw new Error(data.message || "Failed to grant points");
  }

  return { success: true, newBalance: data.new_balance };
};

export const getPointHistory = async (
  supabase: any,
  userId: string,
  limit = 20
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const rootAccount = await db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.authUserId, userId),
    });

    if (!rootAccount) return [];

    return await db.query.pointTransactions.findMany({
      where: eq(pointTransactions.rootAccountId, rootAccount.id),
      orderBy: [desc(pointTransactions.createdAt)],
      limit,
    });
  }

  if (!supabase) throw new Error("Supabase client required");

  const { data: rootAccount } = await supabase
    .from("root_accounts")
    .select("id")
    .eq("auth_user_id", userId)
    .single();

  if (!rootAccount) return [];

  const { data } = await supabase
    .from("point_transactions")
    .select("*")
    .eq("root_account_id", rootAccount.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
};
