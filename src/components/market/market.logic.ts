"use client";

import {
  completeTransactionAction,
  createMarketItemAction,
  getMarketItemsAction,
  startTransactionAction
} from "@/app/actions/market";
import { MarketItem } from "@/components/groups/groups.types";
import useSWR from "swr";

const fetcher = async (key: string) => {
  const [, nationId] = key.split(":");
  return (await getMarketItemsAction(nationId)) as unknown as MarketItem[];
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
    // @ts-ignore
    return await createMarketItemAction(item);
  };
  return { createItem };
};

export const useBuyItem = () => {
  const buyItem = async (itemId: string, buyerId: string) => {
    try {
      const result = await startTransactionAction(itemId, buyerId);
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
    try {
      const result = await completeTransactionAction(transactionId, userId);
      return result;
    } catch (error) {
      console.error("Confirmation failed:", error);
      throw error;
    }
  };
  return { confirmDelivery };
};
