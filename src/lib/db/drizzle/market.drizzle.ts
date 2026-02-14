import { db } from "@/lib/drizzle/client";
import { marketItems } from "@/lib/drizzle/schema";
import { sql } from "drizzle-orm";

/** Drizzle版: マーケットアイテム作成 */
export const createMarketItemDrizzle = async (itemData: {
  nation_id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  type: "sell" | "buy_request";
}) => {
  const result = await db
    .insert(marketItems)
    .values({
      nationId: itemData.nation_id,
      sellerId: itemData.seller_id,
      title: itemData.title,
      description: itemData.description,
      price: String(itemData.price),
      type: itemData.type,
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to create market item");
  return result[0];
};

/**
 * Drizzle版: トランザクション開始（PostgreSQL関数呼び出し）
 * Supabaseの rpc("start_transaction") と同等
 */
export const startTransactionDrizzle = async (
  itemId: string,
  buyerId: string
) => {
  const result = await db.execute(
    sql`SELECT start_transaction(${itemId}::uuid, ${buyerId}::uuid)`
  );
  return result;
};

/**
 * Drizzle版: トランザクション完了（PostgreSQL関数呼び出し）
 * Supabaseの rpc("complete_transaction") と同等
 */
export const completeTransactionDrizzle = async (
  transactionId: string,
  userId: string
) => {
  const result = await db.execute(
    sql`SELECT complete_transaction(${transactionId}::uuid, ${userId}::uuid)`
  );
  return result;
};
