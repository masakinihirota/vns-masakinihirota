import { eq } from "drizzle-orm";

import { db as database } from "./client";
import { marketItems, marketTransactions } from "./schema.postgres";

export type MarketItemType = "sell" | "buy_request";
export type MarketItemStatus = "open" | "sold" | "closed";

export type MarketItem = {
  id: string;
  nation_id: string;
  seller_id: string | null;
  seller_group_id: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  type: MarketItemType | null;
  status: MarketItemStatus | null;
  created_at: string;
  updated_at: string;
};

export type MarketTransaction = {
  id: string;
  item_id: string;
  buyer_id: string | null;
  seller_id: string | null;
  price: number;
  fee_rate: string;
  fee_amount: number;
  seller_revenue: number;
  status: string | null;
  created_at: string;
  completed_at: string | null;
};

type MarketItemSelect = typeof marketItems.$inferSelect;
type MarketTransactionSelect = typeof marketTransactions.$inferSelect;

// Mapper Helpers
/**
 *
 * @param item
 */
function mapToMarketItemDomain(item: MarketItemSelect): MarketItem {
  return {
    id: item.id,
    nation_id: item.nationId,
    seller_id: item.sellerId,
    seller_group_id: item.sellerGroupId,
    title: item.title,
    description: item.description,
    price: item.price,
    currency: item.currency ?? "point",
    type: item.type as MarketItemType,
    status: (item.status || "open") as MarketItemStatus,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

/**
 *
 * @param tx
 */
function mapToTransactionDomain(
  tx: MarketTransactionSelect
): MarketTransaction {
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

export const createMarketItem = async (itemData: Partial<MarketItem>) => {
  const drizzleInput = {
    nationId: itemData.nation_id!,
    sellerId: itemData.seller_id!,
    sellerGroupId: itemData.seller_group_id,
    title: itemData.title!,
    description: itemData.description,
    price: itemData.price!,
    currency: itemData.currency ?? "point",
    type: itemData.type ?? "sell",
    status: itemData.status ?? "open",
  };

  const [newItem] = await database
    .insert(marketItems)
    .values(drizzleInput)
    .returning();
  return mapToMarketItemDomain(newItem);
};

export const startTransaction = async (itemId: string, buyerId: string) => {
  const item = await database.query.marketItems.findFirst({
    where: eq(marketItems.id, itemId),
    with: {
      nation: true,
    },
  });

  if (!item) throw new Error("Market item not found");
  if (item.status !== "open")
    throw new Error("Item is not open for transaction");
  if (!item.nation) throw new Error("Nation not found for item");

  const feeRateValue = Number.parseFloat(item.nation.transactionFeeRate ?? "0");
  const feeRate = feeRateValue / 100;
  const price = item.price;
  const feeAmount = Math.floor(price * feeRate);
  const sellerRevenue = price - feeAmount;

  const [newTx] = await database
    .insert(marketTransactions)
    .values({
      itemId: item.id,
      buyerId: buyerId,
      sellerId: item.sellerId,
      price: price,
      feeRate: feeRateValue.toString(),
      feeAmount: feeAmount,
      sellerRevenue: sellerRevenue,
      status: "pending",
    })
    .returning();

  return newTx.id;
};

export const completeTransaction = async (
  transactionId: string,
  userId: string
) => {
  return await database.transaction(async (tx) => {
    const txRecord = await tx.query.marketTransactions.findFirst({
      where: eq(marketTransactions.id, transactionId),
    });

    if (!txRecord) throw new Error("Transaction not found");
    if (txRecord.status !== "pending")
      throw new Error("Transaction is not pending");

    const userProfileIds = await tx.query.userProfiles.findMany({
      where: (table, { eq: eqFunction }) => {
        return eqFunction(table.rootAccountId, userId);
      },
      columns: { id: true },
    });

    const authorizedProfileIds = new Set(userProfileIds.map((p) => p.id));
    const isAuthorized =
      (txRecord.buyerId && authorizedProfileIds.has(txRecord.buyerId)) ||
      (txRecord.sellerId && authorizedProfileIds.has(txRecord.sellerId));

    if (!isAuthorized) {
      throw new Error(
        "Unauthorized: only buyer or seller can complete this transaction"
      );
    }

    const [updatedTx] = await tx
      .update(marketTransactions)
      .set({
        status: "completed",
        completedAt: new Date().toISOString(),
      })
      .where(eq(marketTransactions.id, transactionId))
      .returning();

    await tx
      .update(marketItems)
      .set({ status: "sold" })
      .where(eq(marketItems.id, txRecord.itemId));

    return mapToTransactionDomain(updatedTx);
  });
};

export const getMarketItemById = async (itemId: string) => {
  const item = await database.query.marketItems.findFirst({
    where: eq(marketItems.id, itemId),
  });
  return item ? mapToMarketItemDomain(item) : null;
};

export const getMarketItems = async (nationId: string = "all") => {
  const items = await database.query.marketItems.findMany({
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

  return items.map(mapToMarketItemDomain);
};
