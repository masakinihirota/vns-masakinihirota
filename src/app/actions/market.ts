"use server";

import * as marketDb from "@/lib/db/market";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/types_db";

type MarketItemInsert = TablesInsert<"market_items">;

export async function createMarketItemAction(itemData: MarketItemInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return marketDb.createMarketItem(supabase, itemData);
}

export async function startTransactionAction(itemId: string, buyerId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return marketDb.startTransaction(supabase, itemId, buyerId);
}

export async function completeTransactionAction(transactionId: string, userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return marketDb.completeTransaction(supabase, transactionId, userId);
}

export async function getMarketItemByIdAction(itemId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return marketDb.getMarketItemById(supabase, itemId);
}

export async function getMarketItemsAction(nationId: string = "all") {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return marketDb.getMarketItems(supabase, nationId);
}
