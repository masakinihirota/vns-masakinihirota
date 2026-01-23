"use client";

import { Sparkles, Zap, CheckCircle2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModeSelectionProps {
  onSelect: (isGamification: boolean) => void;
  isSaving?: boolean;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelect,
  isSaving = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 p-4">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-pink-600 to-violet-700 bg-clip-text text-transparent">
          体験の形を選んでください
        </h1>
        <p className="text-xl text-foreground font-medium">
          サイトをどのように楽しむか、あなたのスタイルに合わせたモードを選択できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* ゲーミフィケーション・モード */}
        <Card
          className={cn(
            "relative overflow-hidden border-2 transition-all hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20",
            "bg-card border-border h-full flex flex-col"
          )}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles size={80} className="text-pink-600" />
          </div>

          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center mb-2">
              <Sparkles className="text-pink-600" size={24} />
            </div>
            <CardTitle className="text-2xl">
              ゲーミフィケーション・モード
            </CardTitle>
            <CardDescription className="text-foreground/80 font-medium">
              世界観を楽しみながら、物語のように機能を学びます。
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 flex-grow">
            <ul className="space-y-2 text-sm text-foreground font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-pink-700" />
                導き手のキャラクター（シュレディンガーちゃん等）が登場
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-pink-700" />
                RPG的なレベルアップ等
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-pink-700" />
                遊び心のあるインターフェース
              </li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 text-lg shadow-md"
              onClick={() => onSelect(true)}
              disabled={isSaving}
            >
              物語を始める
            </Button>
          </div>
        </Card>

        {/* スタンダード・モード */}
        <Card
          className={cn(
            "relative overflow-hidden border-2 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20",
            "bg-card border-border h-full flex flex-col"
          )}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap size={80} className="text-blue-600" />
          </div>

          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <Zap className="text-blue-600" size={24} />
            </div>
            <CardTitle className="text-2xl">通常モード</CardTitle>
            <CardDescription className="text-foreground/80 font-medium">
              すぐに自由に始められる
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 flex-grow">
            <ul className="space-y-2 text-sm text-foreground font-medium mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-700" />
                実用性に特化したクリーンなUI
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-700" />
                余計な演出を封印した静かな環境
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-700" />
                最短ルートでの目的達成
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground mt-4 pt-4 border-t border-blue-500/10">
                <CheckCircle2 size={14} />
                ※ホーム画面やヘッダーからいつでもヘルプやチュートリアルを確認できます。
              </li>
            </ul>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg shadow-md"
              onClick={() => onSelect(false)}
              disabled={isSaving}
            >
              すぐにはじめる
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
