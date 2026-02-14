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
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUserId) {
      const supabase = createClient();
      void supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUserId(data.user.id);
      });
    }
  }, [currentUserId]);

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.title}</CardTitle>
          <Badge variant={item.type === "sell" ? "default" : "secondary"}>
            {item.type === "sell" ? "Sell" : "Buy Request"}
          </Badge>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {item.price.toLocaleString()}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {item.currency}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Status: <span className="capitalize">{item.status}</span>
        </div>
      </CardContent>
      <CardFooter>
        {item.status === "open" && !isOwner && (
          <Button className="w-full" onClick={handleAction} disabled={loading}>
            {loading
              ? "Processing..."
              : item.type === "sell"
                ? "Purchase"
                : "Accept Request"}
          </Button>
        )}
        {item.status !== "open" && (
          <Button className="w-full" disabled variant="outline">
            {item.status === "sold" ? "Sold / In Progress" : "Closed"}
          </Button>
        )}
        {isOwner && (
          <Button className="w-full" variant="outline" disabled>
            Your Item
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
