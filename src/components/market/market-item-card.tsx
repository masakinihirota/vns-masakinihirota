"use client";

import { useState } from "react";
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
import { useBuyItem } from "./market.logic";

interface MarketItemCardProps {
  item: MarketItem;
  onTransactionStart: () => void;
}

export const MarketItemCard = ({
  item,
  onTransactionStart,
}: MarketItemCardProps) => {
  const { buyItem } = useBuyItem();
  const [loading, setLoading] = useState(false);
  // In a real app, we'd get current user from context
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Quick hack to get current user ID for MVP display logic
  // In production, use a proper AuthContext
  if (!currentUserId) {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }

  const isOwner = currentUserId === item.seller_id;

  const handleAction = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      await buyItem(item.id, currentUserId);
      onTransactionStart();
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Failed to start transaction");
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
