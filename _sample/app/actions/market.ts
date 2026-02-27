"use server";

import * as marketDb from "@/lib/db/market";
import type { NewMarketItem } from "@/lib/db/types";


type MarketItemInsert = NewMarketItem;

/**
 *
 * @param itemData
 */
export async function createMarketItemAction(itemData: MarketItemInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return marketDb.createMarketItem(itemData as any as Parameters<typeof marketDb.createMarketItem>[0]);
}

/**
 *
 * @param itemId
 * @param buyerId
 */
export async function startTransactionAction(itemId: string, buyerId: string) {
  return marketDb.startTransaction(itemId, buyerId);
}

/**
 *
 * @param transactionId
 * @param userId
 */
export async function completeTransactionAction(
  transactionId: string,
  userId: string
) {
  return marketDb.completeTransaction(transactionId, userId);
}

/**
 *
 * @param itemId
 */
export async function getMarketItemByIdAction(itemId: string) {
  return marketDb.getMarketItemById(itemId);
}

/**
 *
 * @param nationId
 */
export async function getMarketItemsAction(nationId: string = "all") {
  return marketDb.getMarketItems(nationId);
}
