"use client";

import { Globe, Users } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPARISON_DATA } from "./group-nation-comparison.logic";

/**
 * グループと国の定義を対比して説明するコンポーネント
 *
 * 仕様書に基づき、グラスモーフィズムデザインとレスポンシブなグリッドレイアウトを採用。
 * アクセシビリティ確保のため、最小フォントサイズを18px (text-lg) としています。
 */
export const GroupNationComparison: React.FC = () => {
  return (
    <section
      className="w-full max-w-5xl mx-auto py-16 px-4 space-y-12"
      aria-labelledby="comparison-heading"
    >
      <header className="text-center space-y-4">
        <h2
          id="comparison-heading"
          className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 tracking-tight"
        >
          グループと国の違い
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          VNSにおけるボトムアップ型の「グループ」とトップダウン型の「国」の定義を、それぞれの役割で整理します。
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {COMPARISON_DATA.map((entity) => (
          <Card
            key={entity.id}
            className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
              entity.id === "group"
                ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50"
                : "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50"
            }`}
          >
            <CardHeader className="relative p-8 border-b border-white/20 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div
                  className={`p-4 rounded-3xl shadow-sm ${
                    entity.id === "group"
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-900/80 dark:text-rose-300"
                      : "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/80 dark:text-indigo-300"
                  }`}
                >
                  {entity.id === "group" ? (
                    <Users size={32} />
                  ) : (
                    <Globe size={32} />
                  )}
                </div>
                <CardTitle
                  className={`text-2xl font-bold ${
                    entity.id === "group"
                      ? "text-rose-700 dark:text-rose-200"
                      : "text-indigo-700 dark:text-indigo-200"
                  }`}
                >
                  {entity.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {Object.entries(entity.items).map(([key, item]) => (
                <div key={key} className="space-y-3">
                  <span className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">
                    {item.label}
                  </span>
                  <p className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          システムの最小単位から社会インフラへ
        </div>
      </footer>
    </section>
  );
};
