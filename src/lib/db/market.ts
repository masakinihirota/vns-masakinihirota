import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isDrizzle } from "./adapter";
import {
  completeTransactionDrizzle,
  createMarketItemDrizzle,
  startTransactionDrizzle,
} from "./drizzle";

export type MarketItemType = "sell" | "buy_request";
export type MarketItemStatus = "open" | "sold" | "closed";

export const createMarketItem = async (
  supabase: SupabaseClient<Database>,
  itemData: {
    nation_id: string;
    seller_id: string; // or user_profile_id
    title: string;
    description?: string;
    price: number;
    type: MarketItemType;
  }
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return createMarketItemDrizzle(itemData);
  }

  const { data, error } = await supabase
    .from("market_items")
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const startTransaction = async (
  supabase: SupabaseClient<Database>,
  itemId: string,
  buyerId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return startTransactionDrizzle(itemId, buyerId);
  }

  const { data, error } = await supabase.rpc("start_transaction", {
    p_item_id: itemId,
    p_counter_party_id: buyerId,
  });

  if (error) throw error;
  return data; // Returns transaction ID
};

export const completeTransaction = async (
  supabase: SupabaseClient<Database>,
  transactionId: string,
  userId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return completeTransactionDrizzle(transactionId, userId);
  }

  const { data, error } = await supabase.rpc("complete_transaction", {
    p_transaction_id: transactionId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
};
