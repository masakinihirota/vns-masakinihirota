import { getMarketItemsAction } from "@/app/actions/market";
import { MarketList } from "@/components/market/market-list";

/**
 *
 */
export default async function MarketPage() {
  const items = (await getMarketItemsAction()) as any[];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <MarketList initialItems={items} />
    </div>
  );
}
