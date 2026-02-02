"use client";

/**
 * 最新情報ビューコンポーネント (体験版)
 * タイムライン形式で最新の情報を表示する
 */

import { Globe, Rss, User, Users } from "lucide-react";

/**
 * タイムラインのフィードアイテム（デモ用静的データ）
 */
const FEED_ITEMS = [
  {
    id: 1,
    source: "オアシス国",
    content: "新しい「SFアニメ」カテゴリの特区が建国されました。",
    time: "10分前",
    iconType: "globe",
  },
  {
    id: 2,
    source: "クリエイターギルド",
    content: "メンバーの「ツメニト」さんが新しい作品をTier 1に登録しました。",
    time: "1時間前",
    iconType: "users",
  },
  {
    id: 3,
    source: "佐藤さん",
    content:
      "「昨日僕が感動した作品を、今日の君はまだ知らない。」——素晴らしい短編小説を共有しました。",
    time: "3時間前",
    iconType: "user",
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
    default:
      return <Globe className="text-emerald-500" size={24} />;
  }
}

export function LatestInfoView() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* ウェルカムバナー */}
      <div className="border-l-8 border-blue-600 dark:border-blue-400 pl-8 py-4 bg-slate-50 dark:bg-neutral-900/50 rounded-r-2xl">
        <h2 className="text-[28px] font-extrabold text-slate-800 dark:text-neutral-100">
          おかえりなさい
        </h2>
        <p className="text-slate-600 dark:text-neutral-400 mt-2 leading-relaxed">
          グループや国にいる仲間からの最新情報を表示しています。
          <br />
          インターネットで拾った最新の感動との出会いを楽しみましょう。
        </p>
      </div>

      {/* タイムライン */}
      <div className="space-y-6">
        <h3 className="font-bold text-slate-400 dark:text-neutral-500 flex items-center gap-3 uppercase tracking-widest text-[16px]">
          <Rss size={20} /> タイムライン
        </h3>
        {FEED_ITEMS.map((item) => (
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
                  <span className="font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                    {item.source}
                  </span>
                  <span className="text-slate-300 dark:text-neutral-600">
                    {item.time}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-neutral-300 leading-relaxed font-medium">
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
