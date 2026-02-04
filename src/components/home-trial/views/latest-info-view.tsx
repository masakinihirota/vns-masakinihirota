"use client";

/**
 * 最新情報ビューコンポーネント (体験版)
 * タイムライン形式で最新の情報を表示する
 */

import { Globe, Rss, Trophy, User, Users } from "lucide-react";

export interface PublicWork {
  id: string;
  title: string;
  category: string;
  author: string | null;
  status: string;
}

interface Props {
  works?: PublicWork[];
}

/**
 * タイムラインのフィードアイテム（デモ用静的データ）
 */
const DEMO_ITEMS = [
  {
    id: "demo-1",
    source: "オアシス国",
    content: "新しい「SFアニメ」カテゴリの特区が建国されました。",
    time: "10分前",
    iconType: "globe",
  },
];

/**
 * アイコンタイプからReactコンポーネントに変換
 */
function getIcon(iconType: string) {
  switch (iconType) {
    case "globe":
      return <Globe className="text-emerald-500" size={24} />;
    case "users":
      return <Users className="text-blue-500" size={24} />;
    case "user":
      return <User className="text-purple-500" size={24} />;
    case "work":
      return <Trophy className="text-amber-500" size={24} />;
    default:
      return <Globe className="text-emerald-500" size={24} />;
  }
}

export function LatestInfoView({ works = [] }: Props) {
  // Convert works to feed items
  const workItems = works.map((w) => ({
    id: `work-${w.id}`,
    source: w.author || "Unknown Author",
    content: `新作「${w.title}」(${w.category}) が登録されました。`,
    time: "New!",
    iconType: "work",
  }));

  // Merge and sort (just keeping demo items at bottom for now)
  const feedItems = [...workItems, ...DEMO_ITEMS];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* タイムライン */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-700 dark:text-neutral-200 flex items-center gap-3 uppercase tracking-widest text-[16px]">
          <Rss size={20} /> タイムライン
        </h3>
        {feedItems.length === 0 && (
          <p className="text-slate-500">最新情報はありません。</p>
        )}
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="p-8 border border-slate-100 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/30 shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-all backdrop-blur-sm"
          >
            <div className="flex items-start gap-6">
              <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                {getIcon(item.iconType)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2 text-[18px]">
                  <span className="font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    {item.source}
                  </span>
                  <span className="text-slate-400 dark:text-neutral-400">
                    {item.time}
                  </span>
                </div>
                <p className="text-slate-900 dark:text-neutral-100 leading-relaxed font-bold">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
