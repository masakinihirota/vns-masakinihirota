"use client";

import { Swords, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function ModeSelectionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"gamification" | "normal">("gamification");

  const handleNext = () => {
    // Save mode preference logic here (mock)
    // In real app: await saveUserMode(mode);
    alert(
      `${mode === "gamification" ? "ゲーミフィケーション" : "通常"}モードを選択しました`
    );
    if (mode === "gamification") {
      router.push("/home");
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">
            体験モードの選択
          </CardTitle>
          <CardDescription className="text-lg">
            VNSでの体験スタイルを選択してください。
            <br />
            この設定は後からいつでも変更できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <RadioGroup
            defaultValue="gamification"
            onValueChange={(v) => setMode(v as any)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem
                value="gamification"
                id="gamification"
                className="peer sr-only"
              />
              <Label
                htmlFor="gamification"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 peer-data-[state=checked]:text-indigo-600 cursor-pointer h-full transition-all"
              >
                <div className="mb-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  <Swords className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-lg mb-1">
                    ゲーミフィケーション
                  </span>
                  <span className="text-sm text-muted-foreground whitespace-normal leading-normal">
                    RPGのように楽しみながら自己成長。
                    <br />
                    レベルやクエスト要素あり。
                  </span>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="normal"
                id="normal"
                className="peer sr-only"
              />
              <Label
                htmlFor="normal"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 peer-data-[state=checked]:border-indigo-600 [&:has([data-state=checked])]:border-indigo-600 peer-data-[state=checked]:text-indigo-600 cursor-pointer h-full transition-all"
              >
                <div className="mb-4 p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                  <User className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-lg mb-1">
                    通常モード
                  </span>
                  <span className="text-sm text-muted-foreground whitespace-normal leading-normal">
                    シンプルで機能的なUI。
                    <br />
                    効率的にツールを活用したい人向け。
                  </span>
                </div>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleNext}
              className="px-10 py-6 text-lg rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all font-bold"
            >
              選択して始める
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
