"use client";

import {
  AlertCircle,
  BookOpen,
  Briefcase,
  ChevronRight,
  Ghost,
  Info,
  Sparkles,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MatchingSelectionPage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    null
  );

  // モックデータ：現在のユーザーが持つプロフィール
  const userProfiles = [
    {
      id: "p1",
      name: "エンジニア・拓也",
      purpose: "仕事仲間・創作",
      avatar: <Briefcase className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      description: "技術スタックや開発経験を重視したマッチングを行います。",
    },
    {
      id: "p2",
      name: "読書家・タク",
      purpose: "趣味仲間・教養",
      avatar: <BookOpen className="w-5 h-5" />,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      description: "好きな作品に基づいた感性の近い人を探します。",
    },
    {
      id: "p3",
      name: "匿名・T",
      purpose: "相談相手・人生",
      avatar: <Ghost className="w-5 h-5" />,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      description: "匿名性を保ちつつ、深い価値観の対話を目的とします。",
    },
  ];

  const navigationItems = [
    {
      id: "auto",
      title: "自動マッチング",
      subtitle: "Automatic Matching",
      description:
        "AIがあなたの価値観と作品リストを分析し、最適なパートナーを提案します。",
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      features: ["高速検索", "スコアリング", "24時間対応"],
      color: "border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10",
      href: "/matching-auto",
    },
    {
      id: "manual",
      title: "手動マッチング",
      subtitle: "Manual Matching",
      description:
        "コンシェルジュが文脈を考慮してペアリングを行います。特別な目的に。",
      icon: <UserPlus className="w-8 h-8 text-purple-500" />,
      features: ["コンシェルジュ介在", "精密な調整", "個別相談"],
      color: "border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10",
      href: "/matching-manual",
    },
  ];

  const selectedProfile = userProfiles.find((p) => p.id === selectedProfileId);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans flex overflow-hidden">
      {/* 左サイドバー：プロフィール選択リスト */}
      <aside className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen bg-gray-50/50 dark:bg-gray-900/20 shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              使用する仮面
            </h2>
            <span className="text-[10px] bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500">
              {userProfiles.length}個のプロフィール
            </span>
          </div>

          <div className="space-y-3">
            {userProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfileId(profile.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${
                  selectedProfileId === profile.id
                    ? "border-blue-500 bg-white dark:bg-gray-800 shadow-lg scale-[1.02]"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div
                  className={`p-2 rounded-xl flex-shrink-0 ${profile.color}`}
                >
                  {profile.avatar}
                </div>
                <div className="overflow-hidden">
                  <p
                    className={`font-bold truncate text-sm ${
                      selectedProfileId === profile.id
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {profile.purpose}
                  </p>
                </div>
                {selectedProfileId === profile.id && (
                  <div className="ml-auto mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800">
          <button className="w-full py-3 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
            <User className="w-4 h-4" />
            新しい仮面を作る
          </button>
        </div>
      </aside>

      {/* 右側：メインコンテンツ */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* ヘッダーセクション */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              マッチング選択
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              現在選択中のプロフィールに基づいて、新しい繋がりを探します。
            </p>
          </div>

          {/* 選択中のプロフィール概要（ステータスバー） */}
          {selectedProfile && (
            <div className="mb-10 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedProfile.color}`}>
                  {selectedProfile.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{selectedProfile.name}</span>
                    <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">
                      {selectedProfile.purpose}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedProfile.description}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                  Matching Status
                </span>
                <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Ready to match
                </span>
              </div>
            </div>
          )}

          {!selectedProfileId && (
            <div className="mb-10 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 flex items-center gap-3 text-amber-700 dark:text-amber-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">
                マッチングを開始するには、左側からプロフィールを選択してください。
              </p>
            </div>
          )}

          {/* マッチングモードボタン（カード） */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {!selectedProfileId && (
              <div className="absolute inset-0 z-10 bg-white/40 dark:bg-gray-950/40 backdrop-blur-[1px] rounded-3xl cursor-not-allowed" />
            )}

            {navigationItems.map((item) => (
              <Link
                key={item.id}
                href={selectedProfileId ? item.href : "#"}
                onClick={(e) => {
                  if (!selectedProfileId) {
                    e.preventDefault();
                  }
                }}
                className={`group relative overflow-hidden rounded-3xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
                  item.color
                } ${!selectedProfileId ? "grayscale opacity-50" : "hover:-translate-y-1 cursor-pointer"}`}
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-4 uppercase tracking-wider">
                    {item.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed text-sm">
                    {item.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {item.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-xs text-gray-700 dark:text-gray-300"
                      >
                        <Zap className="w-3.5 h-3.5 mr-2 text-yellow-500 fill-yellow-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-sm font-bold text-gray-900 dark:text-white group-hover:translate-x-2 transition-transform duration-300">
                  {selectedProfileId ? "この仮面で進む" : "プロフィールを選択"}
                  <ChevronRight className="ml-2 w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-start gap-4">
            <Info className="w-6 h-6 text-gray-400 flex-shrink-0" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">
                マッチングの仕組み
              </p>
              VNSでは「盾（プロフィール）」ごとに異なる価値観データを使用します。
              目的が「仕事」ならスキル重視、「趣味」なら作品評価重視のマッチングが行われます。
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
