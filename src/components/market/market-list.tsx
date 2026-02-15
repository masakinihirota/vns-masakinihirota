"use client";

import { getMarketItemsAction } from "@/app/actions/market";
import { MarketItem } from "@/components/groups/groups.types";
import { MarketCreateModal } from "@/components/market/market-create-modal";
import { MarketItemCard } from "@/components/market/market-item-card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0B0F1A] p-4 md:p-8 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase italic">
                VNS <span className="text-emerald-600 dark:text-emerald-400">Marketplace</span>
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">
                価値と信頼の交換所
              </p>
            </div>
            <MarketCreateModal nationId={nationId} onSuccess={refreshItems} />
          </div>
        </section>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40 dark:bg-white/[0.02] backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
          <div className="w-full md:max-w-md relative">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 h-11 bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/10 rounded-xl focus:ring-emerald-500/50 transition-all font-medium"
            />
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto grid grid-cols-3 h-11 bg-neutral-200/50 dark:bg-black/20 p-1 rounded-xl">
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm transition-all font-bold"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="rounded-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-300 transition-all font-bold"
              >
                For Sale
              </TabsTrigger>
              <TabsTrigger
                value="buy_request"
                className="rounded-lg data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 transition-all font-bold"
              >
                Requests
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item) => (
            <MarketItemCard
              key={item.id}
              item={item}
              onTransactionStart={refreshItems}
            />
          ))}
          {filteredItems?.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 dark:bg-white/5 mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                No items found
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
