import { getPointHistoryAction } from "@/app/actions/rewards";
import { DailyBonusButton } from "@/components/rewards/daily-bonus-button";
import { PointHistory } from "@/components/rewards/point-history";
import { Separator } from "@/components/ui/separator";
import { type PointTransaction } from "@/lib/db/rewards";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "報酬・ポイント | VNS",
  description: "ポイントの獲得履歴と報酬の確認",
};

export const dynamic = "force-dynamic";

export default async function RewardsPage() {
  const transactions: PointTransaction[] = await getPointHistoryAction();

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">報酬・ポイント</h1>
        <p className="text-muted-foreground">
          獲得したポイントと履歴を確認できます。
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-bold">デイリーボーナス</h2>
        <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
          <p className="mb-4">
            毎日ログインしてボーナスポイントを受け取りましょう。
          </p>
          <DailyBonusButton />
        </div>
      </div>

      <Separator />

      <PointHistory transactions={transactions} />
    </div>
  );
}
