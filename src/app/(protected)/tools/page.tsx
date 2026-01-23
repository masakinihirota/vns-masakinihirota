"use client";

import { ArrowRight, PenTool } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ToolsPage() {
  const tools = [
    {
      title: "旧 曼荼羅チャート",
      path: "/tools/mandala-chart",
      desc: "旧形式の曼荼羅チャート（互換用）。",
    },
    // ここに将来のツールを追加
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-8 dark:bg-[#020204] font-sans transition-colors duration-500">
      <main className="container mx-auto space-y-16 max-w-7xl">
        {/* ヘッダーセクション */}
        <section className="flex flex-col items-center gap-8 text-center py-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-zinc-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-zinc-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-zinc-500/40">
              <PenTool className="text-white" size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter italic uppercase text-neutral-900 dark:text-white">
              Tools <span className="text-zinc-500">Collection</span>
            </h1>
          </div>
          <p className="text-xl text-neutral-500 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed">
            開発者・管理者向けのユーティリティツール一覧。
            <br />
            実験的な機能やレガシーなツールへのアクセスを提供します。
          </p>
        </section>

        {/* ツール一覧グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {tools.map((tool, idx) => (
            <Card
              key={idx}
              className="group relative overflow-hidden border-none bg-white dark:bg-[#09090b] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem]"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-zinc-500/20 to-slate-500/20 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500`}
              />

              <CardHeader className="relative z-10 p-8">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-300">
                    {tool.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 p-8 pt-0">
                <p className="text-base text-neutral-500 dark:text-zinc-500 font-medium leading-relaxed mb-8 min-h-[60px]">
                  {tool.desc}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full flex justify-between bg-neutral-50 dark:bg-zinc-950/50 hover:bg-zinc-600 hover:text-white dark:hover:bg-zinc-600 rounded-2xl py-6 px-6 font-black transition-all group"
                >
                  <Link href={tool.path}>
                    <span>OPEN TOOL</span>
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
