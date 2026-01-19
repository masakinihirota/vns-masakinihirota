"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TutorialPage() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/root-accounts/create");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-2">
            チュートリアル
          </CardTitle>
          <CardDescription>
            VNSの世界へようこそ。ここでは基本的な操作方法を学びます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-8 rounded-lg text-center h-64 flex items-center justify-center">
            <p className="text-slate-500 font-medium">
              チュートリアル動画またはスライドショーがここに表示されます
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={handleNext}>
              スキップ
            </Button>
            <Button onClick={handleNext}>次へ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
