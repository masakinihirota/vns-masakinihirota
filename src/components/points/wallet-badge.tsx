"use client";

import { getRootAccountAction } from "@/app/actions/root-accounts";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

export const WalletBadge = () => {
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const account = await getRootAccountAction();
        if (account) {
          setPoints(account.points);
        }
      } catch (error) {
        console.error("Failed to fetch points:", error);
      }
    };
    void fetchPoints();
  }, []);

  if (points === null) return null;

  return (
    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
      <Wallet className="w-4 h-4 text-yellow-500" />
      <span className="font-mono font-bold text-yellow-600 dark:text-yellow-400">
        {points.toLocaleString()} pts
      </span>
    </Badge>
  );
};
