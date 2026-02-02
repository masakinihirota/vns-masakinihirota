"use client";

import { TutorialHeader } from "@/components/layout/tutorial-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BasicTutorialPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <TutorialHeader title="基本操作ガイド" />

      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">基本操作ガイド</h1>
          <p className="text-muted-foreground">
            VNSの主要機能と使い方をマスターしましょう
          </p>
        </div>

        {/* プレースホルダー: スライドショーエリア */}
        <Card className="min-h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Step 1: プロフィールを作成しよう</CardTitle>
            <CardDescription>
              あなたの強みや価値観を登録して、最適なマッチングを受けましょう。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 mx-6 rounded-md">
            <p className="text-muted-foreground">
              ここにチュートリアルスライド画像や動画が入ります
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button variant="outline" disabled>
              前へ
            </Button>
            <div className="text-sm font-medium">1 / 5</div>
            <Button>次へ</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
