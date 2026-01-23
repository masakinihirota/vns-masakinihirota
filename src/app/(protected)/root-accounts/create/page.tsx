"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RootAccountCreatePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Rootアカウントを作成中...");

  useEffect(() => {
    // Simulate creation process
    const timer1 = setTimeout(() => {
      setStatus("設定を適用中...");
    }, 1500);

    const timer2 = setTimeout(() => {
      setStatus("完了しました！");
      // Redirect to User Profile Creation (Mask Making)
      router.push("/user-profiles/new");
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle>{status}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
          <p className="text-slate-500 text-sm">
            画面が切り替わるまでお待ちください
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
