"use server";

import * as marketDb from "@/lib/db/market";
import type { TablesInsert } from "@/types/types_db";

type MarketItemInsert = TablesInsert<"market_items">;

export async function createMarketItemAction(itemData: MarketItemInsert) {
  return marketDb.createMarketItem(itemData);
}

export async function startTransactionAction(itemId: string, buyerId: string) {
  return marketDb.startTransaction(itemId, buyerId);
}

export async function completeTransactionAction(
  transactionId: string,
  userId: string
) {
  return marketDb.completeTransaction(transactionId, userId);
}

export async function getMarketItemByIdAction(itemId: string) {
  return marketDb.getMarketItemById(itemId);
}

export async function getMarketItemsAction(nationId: string = "all") {
  return marketDb.getMarketItems(nationId);
}
