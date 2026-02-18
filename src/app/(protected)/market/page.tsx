import { getMarketItemsAction } from "@/app/actions/market";
import { MarketItem } from "@/components/groups/groups.types";
import { MarketList } from "@/components/market/market-list";

export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const items = (await getMarketItemsAction()) as MarketItem[];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MarketList initialItems={items} />
    </div>
  );
}
