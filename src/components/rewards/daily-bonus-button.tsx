"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { claimDailyBonusAction } from "@/app/actions/rewards";
import { Button } from "@/components/ui/button";

export function DailyBonusButton() {
  const [isPending, startTransition] = useTransition();

  const handleClaim = () => {
    startTransition(async () => {
      const result = await claimDailyBonusAction();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={isPending}
      className="w-full sm:w-auto"
    >
      {isPending ? "処理中..." : "デイリーボーナスを受け取る"}
    </Button>
  );
}
