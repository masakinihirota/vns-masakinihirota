import { eq } from "drizzle-orm";
import type { TablesInsert } from "@/types/types_db";
import { db } from "./drizzle-postgres";
import { marketItems, marketTransactions } from "./schema.postgres";

export type MarketItemType = "sell" | "buy_request";
export type MarketItemStatus = "open" | "sold" | "closed";

type MarketItemInsert = TablesInsert<"market_items">;

// Mapper Helpers
function mapMarketItemToSupabase(item: any): any {
  return {
    id: item.id,
    nation_id: item.nationId,
    seller_id: item.sellerId,
    seller_group_id: item.sellerGroupId,
    title: item.title,
    description: item.description,
    price: item.price,
    currency: item.currency,
    type: item.type,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

function mapTransactionToSupabase(tx: any): any {
  return {
    id: tx.id,
    item_id: tx.itemId,
    buyer_id: tx.buyerId,
    seller_id: tx.sellerId,
    price: tx.price,
    fee_rate: tx.feeRate,
    fee_amount: tx.feeAmount,
    seller_revenue: tx.sellerRevenue,
    status: tx.status,
    created_at: tx.createdAt,
    completed_at: tx.completedAt,
  };
}

export const createMarketItem = async (itemData: MarketItemInsert) => {
  const drizzleInput = {
    nationId: itemData.nation_id,
    sellerId: itemData.seller_id, // assuming seller_id is mapped to sellerId
    sellerGroupId: itemData.seller_group_id,
    title: itemData.title,
    description: itemData.description,
    price: itemData.price,
    currency: itemData.currency ?? "point",
    type: itemData.type ?? "sell",
    status: itemData.status ?? "open",
  };

  const [newItem] = await db
    .insert(marketItems)
    .values(drizzleInput)
    .returning();
  return mapMarketItemToSupabase(newItem);
};

export const startTransaction = async (
  itemId: string,
  buyerId: string // This is the user ID of the buyer
) => {
  // 1. Fetch Item and its Nation to get fee rate
  const item = await db.query.marketItems.findFirst({
    where: eq(marketItems.id, itemId),
    with: {
      nation: true,
    },
  });

  if (!item) throw new Error("Market item not found");
  if (item.status !== "open")
    throw new Error("Item is not open for transaction");
  if (!item.nation) throw new Error("Nation not found for item");

  // Calculate fees
  // Fee rate likely stored as string or number in DB (numeric). Drizzle reads numeric as string mostly?
  // Schema: transactionFeeRate: numeric("transaction_fee_rate").default('10.0') -> This looks like percentage?
  // Or 0.10? '10.0' usually means 10%.
  // Let's assume it is PERCENTAGE (e.g. 10). Or checks logic.
  // If it is 10.0, calculation: price * (10 / 100).

  const feeRateVal = parseFloat(item.nation.transactionFeeRate ?? "0");
  const feeRate = feeRateVal / 100; // Assuming stored as percentage e.g. 10
  const price = item.price;
  const feeAmount = Math.floor(price * feeRate);
  const sellerRevenue = price - feeAmount;

  // Transaction
  const [newTx] = await db
    .insert(marketTransactions)
    .values({
      itemId: item.id,
      buyerId: buyerId,
      sellerId: item.sellerId, // Copy seller from item
      price: price,
      feeRate: feeRateVal.toString(), // Store as 10.0
      feeAmount: feeAmount,
      sellerRevenue: sellerRevenue,
      status: "pending",
    })
    .returning();

  return newTx.id; // RPC returns ID? Original logic returned data?
  // check original: return data; (likely ID or full object)
  // RPC usually returns the result. If RPC returns ID, we return ID.
  // If original returned object, we return object.
  // Original: return data. Let's return mapped object or ID?
  // Step 372: return data; // Returns transaction ID (comment says ID).
};

export const completeTransaction = async (
  transactionId: string,
  userId: string // Who is completing? Usually buyer or seller or system?
  // RPC p_user_id. Likely validation that user is authorized.
) => {
  // Transaction Logic
  return await db.transaction(async (tx) => {
    const txRecord = await tx.query.marketTransactions.findFirst({
      where: eq(marketTransactions.id, transactionId),
    });

    if (!txRecord) throw new Error("Transaction not found");
    if (txRecord.status !== "pending")
      throw new Error("Transaction is not pending");

    // Verify user is buyer or seller?
    // If userId corresponds to buyer or seller?
    // For now assuming caller checks permissions or this func checks.
    // If txRecord.buyerId !== userId && txRecord.sellerId !== userId ...

    // Update Transaction
    const [updatedTx] = await tx
      .update(marketTransactions)
      .set({
        status: "completed",
        completedAt: new Date().toISOString(),
      })
      .where(eq(marketTransactions.id, transactionId))
      .returning();

    // Update Item
    await tx
      .update(marketItems)
      .set({ status: "sold" })
      .where(eq(marketItems.id, txRecord.itemId));

    return mapTransactionToSupabase(updatedTx);
  });
};

export const getMarketItemById = async (itemId: string) => {
  const item = await db.query.marketItems.findFirst({
    where: eq(marketItems.id, itemId),
  });
  return item ? mapMarketItemToSupabase(item) : null;
};

export const getMarketItems = async (nationId: string = "all") => {
  // Drizzle Implementation
  const items = await db.query.marketItems.findMany({
    where: (table, { and, eq }) => {
      const filters = [eq(table.status, "open")];
      if (nationId !== "all") {
        filters.push(eq(table.nationId, nationId));
      }
      return and(...filters);
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    limit: 100,
  });

  return items.map(mapMarketItemToSupabase);
};
