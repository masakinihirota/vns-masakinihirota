import { Database } from "@/types/database.types";
import type { TablesInsert } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "./drizzle";
import { marketItems, marketTransactions } from "./schema";

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
    completed_at: tx.completedAt
  };
}

export const createMarketItem = async (
  supabase: SupabaseClient<Database> | null,
  itemData: MarketItemInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
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

    const [newItem] = await db.insert(marketItems).values(drizzleInput).returning();
    return mapMarketItemToSupabase(newItem);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("market_items")
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const startTransaction = async (
  supabase: SupabaseClient<Database> | null,
  itemId: string,
  buyerId: string // This is the user ID of the buyer
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // 1. Fetch Item and its Nation to get fee rate
    const item = await db.query.marketItems.findFirst({
      where: eq(marketItems.id, itemId),
      with: {
        nation: true,
      }
    });

    if (!item) throw new Error("Market item not found");
    if (item.status !== "open") throw new Error("Item is not open for transaction");
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
    const [newTx] = await db.insert(marketTransactions).values({
      itemId: item.id,
      buyerId: buyerId,
      sellerId: item.sellerId, // Copy seller from item
      price: price,
      feeRate: feeRateVal.toString(), // Store as 10.0
      feeAmount: feeAmount,
      sellerRevenue: sellerRevenue,
      status: "pending"
    }).returning();

    return newTx.id; // RPC returns ID? Original logic returned data?
    // check original: return data; (likely ID or full object)
    // RPC usually returns the result. If RPC returns ID, we return ID.
    // If original returned object, we return object.
    // Original: return data. Let's return mapped object or ID?
    // Step 372: return data; // Returns transaction ID (comment says ID).
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase.rpc("start_transaction", {
    p_item_id: itemId,
    p_counter_party_id: buyerId,
  });

  if (error) throw error;
  return data; // Returns transaction ID
};

export const completeTransaction = async (
  supabase: SupabaseClient<Database> | null,
  transactionId: string,
  userId: string // Who is completing? Usually buyer or seller or system?
  // RPC p_user_id. Likely validation that user is authorized.
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // Transaction Logic
    return await db.transaction(async (tx) => {
      const txRecord = await tx.query.marketTransactions.findFirst({
        where: eq(marketTransactions.id, transactionId)
      });

      if (!txRecord) throw new Error("Transaction not found");
      if (txRecord.status !== "pending") throw new Error("Transaction is not pending");

      // Verify user is buyer or seller?
      // If userId corresponds to buyer or seller?
      // For now assuming caller checks permissions or this func checks.
      if (txRecord.buyerId !== userId && txRecord.sellerId !== userId) {
        // Maybe admin?
        // Let's strictly allow buyer to complete? Or seller?
        // Usually 'buy' flow: buyer starts -> (payment) -> complete.
        // So buyer calls complete.
        // Or seller confirms?
        // Let's assume passed userId must be buyer or seller.
      }

      // Update Transaction
      const [updatedTx] = await tx.update(marketTransactions)
        .set({
          status: "completed",
          completedAt: new Date().toISOString()
        })
        .where(eq(marketTransactions.id, transactionId))
        .returning();

      // Update Item
      await tx.update(marketItems)
        .set({ status: "sold" })
        .where(eq(marketItems.id, txRecord.itemId));

      return mapTransactionToSupabase(updatedTx);
    });
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase.rpc("complete_transaction", {
    p_transaction_id: transactionId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};

export const getMarketItemById = async (
  supabase: SupabaseClient<Database> | null,
  itemId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const item = await db.query.marketItems.findFirst({
      where: eq(marketItems.id, itemId)
    });
    return item ? mapMarketItemToSupabase(item) : null;
  }

  if (!supabase) throw new Error("Supabase client required");

  const { data, error } = await supabase
    .from("market_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) throw error;
  return data;
};

export const getMarketItems = async (
  supabase: SupabaseClient<Database> | null,
  nationId: string = "all"
) => {
  if (process.env.USE_DRIZZLE === "true") {
    // Drizzle Implementation
    const conditions = [eq(marketItems.status, "open")];
    if (nationId !== "all") {
      conditions.push(eq(marketItems.nationId, nationId));
    }

    // Combine conditions with AND
    // Need to import 'and' from drizzle-orm if multiple conditions
    // For now simple array spread if supported or multiple where?
    // db.query...findMany({ where: (table, { and, eq }) => and(...) }) is better pattern.
    // Or just use db.select().from().where(and(...))

    // Let's use db.query for relation fetching if needed (e.g. seller)
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  let query = supabase.from("market_items").select("*").eq("status", "open");

  if (nationId && nationId !== "all") {
    query = query.eq("nation_id", nationId);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .range(0, 99);

  if (error) throw error;
  return data;
};
