"use client";

import { Star, TrendingUp, UserPlus, Trophy, Eye } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Work {
  id: string;
  title: string;
  category: "anime" | "manga";
  tier: 1 | 2 | 3;
}

const MOCK_POPULAR_WORKS: Work[] = [
  { id: "1", title: "チェンソーマン", category: "manga", tier: 1 },
  { id: "2", title: "呪術廻戦", category: "manga", tier: 1 },
  { id: "3", title: "推しの子", category: "anime", tier: 1 },
  { id: "4", title: "葬送のフリーレン", category: "anime", tier: 2 },
  { id: "5", title: "ブルーロック", category: "manga", tier: 2 },
  { id: "6", title: "SPY×FAMILY", category: "anime", tier: 2 },
  { id: "7", title: "ダンダダン", category: "manga", tier: 3 },
  { id: "8", title: "怪獣8号", category: "manga", tier: 3 },
  { id: "9", title: "薬屋のひとりごと", category: "anime", tier: 3 },
];

export function PopularWorksView() {
  const renderTierGroup = (tier: 1 | 2 | 3) => {
    const works = MOCK_POPULAR_WORKS.filter((w) => w.tier === tier);
    const tierLabels = [
      "Tier 1: 圧倒的な観測数",
      "Tier 2: 評価の上昇",
      "Tier 3: 注目すべき潮流",
    ];
    const tierIcons = [
      <Trophy key="1" className="text-yellow-500" size={24} />,
      <Star key="2" className="text-slate-300" size={24} />,
      <TrendingUp key="3" className="text-amber-700" size={24} />,
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-2">
          {tierIcons[tier - 1]}
          <h3 className="text-xl font-bold text-white font-serif italic">
            {tierLabels[tier - 1]}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work) => (
            <Card
              key={work.id}
              className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all group"
            >
              <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg text-neutral-100 group-hover:text-indigo-400 transition-colors">
                    {work.title}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-widest text-neutral-400"
                  >
                    {work.category}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* 導線バナー：閲覧モードからプロフィール登録への誘導 */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Eye className="text-indigo-400" size={20} />
              <Badge
                variant="outline"
                className="text-indigo-300 border-indigo-500/30 font-bold uppercase tracking-tighter"
              >
                お試し・閲覧モード
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white font-serif italic">
              お気に入りの作品を登録して、
              <br className="hidden md:block" />
              自分にぴったりの作品を見つけよう。
            </h2>
            <p className="text-neutral-400 max-w-xl leading-relaxed">
              現在は個別の設定がされていないため、サイト全体の人気トレンドを表示しています。
              <br />
              プロフィールを登録すると、あなたの好みに近いユーザーがおすすめする作品が表示されるようになります。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 group"
            >
              <Link href="/user-profiles/new">
                <UserPlus size={20} />
                <span>プロフィールを登録する</span>
              </Link>
            </Button>
          </div>
        </div>
        {/* 背景の装飾 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
            Global <span className="text-indigo-500">Trends</span>
          </h2>
          <p className="text-neutral-500 font-medium max-w-2xl mx-auto">
            サイト全体で今注目されている作品のトレンドです。
            <br />
            多くのユーザーから高く評価され、話題になっている作品をチェックしましょう。
          </p>
        </div>

        <div className="space-y-16">
          {renderTierGroup(1)}
          {renderTierGroup(2)}
          {renderTierGroup(3)}
        </div>
      </div>
    </div>
  );
}
