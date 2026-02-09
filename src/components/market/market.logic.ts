"use client";

import useSWR from "swr";
import { MarketItem } from "@/components/groups/groups.types";
import { completeTransaction, startTransaction } from "@/lib/db/market";
import { createClient } from "@/lib/supabase/client";

const fetcher = async (key: string) => {
  const [, nationId] = key.split(":");
  const supabase = createClient();
  let query = supabase.from("market_items").select("*").eq("status", "open");

  if (nationId && nationId !== "all") {
    query = query.eq("nation_id", nationId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data as MarketItem[];
};

export const useMarketItems = (nationId: string = "all") => {
  const { data, error, isLoading, mutate } = useSWR<MarketItem[]>(
    `market:${nationId}`,
    fetcher
  );

  return {
    items: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useCreateItem = () => {
  const createItem = async (
    item: Omit<MarketItem, "id" | "created_at" | "updated_at">
  ) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("market_items")
      .insert(item)
      .select()
      .single();
    if (error) throw error;
    return data as MarketItem;
  };
  return { createItem };
};

export const useBuyItem = () => {
  const buyItem = async (itemId: string, buyerId: string) => {
    const supabase = createClient();
    try {
      const result = await startTransaction(supabase, itemId, buyerId);
      return result;
    } catch (error) {
      console.error("Purchase failed:", error);
      throw error;
    }
  };
  return { buyItem };
};

export const useConfirmDelivery = () => {
  const confirmDelivery = async (transactionId: string, userId: string) => {
    const supabase = createClient();
    try {
      const result = await completeTransaction(supabase, transactionId, userId);
      return result;
    } catch (error) {
      console.error("Confirmation failed:", error);
      throw error;
    }
  };
  return { confirmDelivery };
};
