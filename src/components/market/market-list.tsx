"use client";

import { useState } from "react";
import { getMarketItemsAction } from "@/app/actions/market";
import { MarketItem } from "@/components/groups/groups.types";
import { MarketCreateModal } from "@/components/market/market-create-modal";
import { MarketItemCard } from "@/components/market/market-item-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MarketListProps {
  nationId?: string;
  initialItems?: MarketItem[];
}

export const MarketList = ({
  nationId = "all",
  initialItems = [],
}: MarketListProps) => {
  const [items, setItems] = useState<MarketItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const refreshItems = async () => {
    try {
      const updatedItems = (await getMarketItemsAction(
        nationId
      )) as MarketItem[];
      setItems(updatedItems);
    } catch (error) {
      console.error("Failed to refresh items", error);
    }
  };

  const filteredItems = items?.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sell" && item.type === "sell") ||
      (activeTab === "buy_request" && item.type === "buy_request");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <MarketCreateModal nationId={nationId} onSuccess={refreshItems} />
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md mb-4"
        />

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="sell">For Sale</TabsTrigger>
            <TabsTrigger value="buy_request">Buy Requests</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems?.map((item) => (
          <MarketItemCard
            key={item.id}
            item={item}
            onTransactionStart={refreshItems}
          />
        ))}
        {filteredItems?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-12">
            No items found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
