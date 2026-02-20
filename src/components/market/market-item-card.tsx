"use client";

import { startTransactionAction } from "@/app/actions/market";
import { MarketItem } from "@/components/groups/groups.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

interface MarketItemCardProps {
  item: MarketItem;
  onTransactionStart: () => void;
}

export const MarketItemCard = ({
  item,
  onTransactionStart,
}: MarketItemCardProps) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id ?? null;

  const isOwner = currentUserId === item.seller_id;

  const handleAction = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      await startTransactionAction(item.id, currentUserId);
      onTransactionStart();
      toast.success("Transaction started!");
    } catch (error) {
      console.error("Transaction failed", error);
      toast.error("Failed to start transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/40 dark:bg-white/[0.02] backdrop-blur-md border-white/20 dark:border-white/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-transparent pointer-events-none" />

      <CardHeader className="relative z-10">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {item.title}
          </CardTitle>
          <Badge
            variant="outline"
            className={
              item.type === "sell"
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
            }
          >
            {item.type === "sell" ? "Sell" : "Request"}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-neutral-500 dark:text-neutral-400 h-10">
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            {item.price.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase">
            {item.currency}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          <div
            className={`w-2 h-2 rounded-full ${item.status === "open" ? "bg-emerald-500 animate-pulse" : "bg-neutral-500"}`}
          />
          {item.status}
        </div>
      </CardContent>

      <CardFooter className="relative z-10 bg-neutral-50/50 dark:bg-black/20 p-4 border-t border-white/10 dark:border-white/5">
        {item.status === "open" && !isOwner && (
          <Button
            className="w-full font-bold shadow-md hover:shadow-lg transition-all"
            onClick={handleAction}
            disabled={loading}
            variant={item.type === "sell" ? "default" : "secondary"}
          >
            {loading ? (
              "Processing..."
            ) : item.type === "sell" ? (
              <>Purchase Item</>
            ) : (
              <>Accept Request</>
            )}
          </Button>
        )}
        {item.status !== "open" && (
          <Button
            className="w-full bg-neutral-200 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border-transparent"
            disabled
            variant="outline"
          >
            {item.status === "sold" ? "Sold Out" : "Closed"}
          </Button>
        )}
        {isOwner && (
          <Button
            className="w-full border-dashed border-2 bg-transparent text-neutral-500"
            variant="outline"
            disabled
          >
            You Own This
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
