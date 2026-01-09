"use client";

import {
  Home as HomeIcon,
  Zap,
  Handshake,
  PenTool,
  FlaskConical,
  ChevronRight,
  ArrowRight,
  Book,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const sections = [
    {
      title: "🚀 開発中・ピックアップ",
      description: "現在アクティブに開発・検証されている最新機能",
      color: "from-indigo-500/20 to-purple-500/20",
      icon: <Zap className="text-indigo-500" size={24} />,
      routes: [
        {
          title: "始まりの国",
          path: "/beginning-country",
          desc: "プロフィールの作成、または幽霊として観測を始める儀式ページ。",
          badge: "PickUp",
        },
        {
          title: "曼荼羅チャート",
          path: "/mandala-chart",
          desc: "深層心理や思考を81マスのグリッドで整理（プロフェッショナル版）。",
          badge: "New",
        },
        {
          title: "新規プロフィールの作成",
          path: "/user-profiles/new",
          desc: "新しいプロフィール（仮面）を受肉するウィザード形式の作成フロー。",
          badge: "New",
        },
        {
          title: "体験モード選択",
          path: "/onboarding/mode-selection",
          desc: "ゲーミフィケーションかスタンダードか、体験の質を選択。",
          badge: "Update",
        },
      ],
    },
    {
      title: "🏠 アカウントとプロフィール",
      description: "自己の管理と拠点の構築",
      color: "from-blue-500/20 to-indigo-500/20",
      icon: <HomeIcon className="text-blue-500" size={24} />,
      routes: [
        {
          title: "メインダッシュボード",
          path: "/home",
          desc: "VNSシステム全体の中心となるポータル画面。",
          badge: "Core",
        },
        {
          title: "マイプロフィール",
          path: "/profile",
          desc: "現在のプロフィール情報の閲覧、作品の評価・相性確認。",
        },
        {
          title: "仮面一覧 (Profiles)",
          path: "/user-profiles",
          desc: "作成済みのプロフィール（仮面）の一覧管理。",
        },
        {
          title: "ルートアカウント",
          path: "/root-accounts",
          desc: "アカウント全体の属性管理・セキュリティ設定。",
        },
      ],
    },
    {
      title: "🤝 縁結びの杜",
      description: "マッチング・相性診断システム",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <Handshake className="text-emerald-500" size={24} />,
      routes: [
        {
          title: "マッチングハブ",
          path: "/matching",
          desc: "マッチングシステムのメインエントランス。",
          badge: "Core",
        },
        {
          title: "自動マッチング",
          path: "/matching/auto",
          desc: "アルゴリズムに基づく最適な対象との自動照合。",
        },
        {
          title: "手動マッチング",
          path: "/matching/manual",
          desc: "条件を指定して自ら縁を探す能動的な照合。",
        },
        {
          title: "投票マッチ (Vote Match)",
          path: "/vote-match",
          desc: "社会・政治的価値観に基づく相性算出。",
        },
      ],
    },
    {
      title: "🎨 創造と価値観",
      description: "作品登録・思考の整理",
      color: "from-amber-500/20 to-orange-500/20",
      icon: <PenTool className="text-amber-500" size={24} />,
      routes: [
        {
          title: "価値観リスト",
          path: "/values",
          desc: "登録されている価値観の一覧と詳細。",
          badge: "New",
        },
        {
          title: "価値観の選定",
          path: "/values-selection",
          desc: "自分にとって重要な5つの価値観を定義する。",
        },
        {
          title: "作品登録 / 一覧",
          path: "/works",
          desc: "全ての作品データのディレクトリと新規登録フォーム。",
        },
      ],
    },
    {
      title: "📚 ヘルプとドキュメント",
      description: "VNSの哲学・用語集・サポート",
      color: "from-teal-500/20 to-emerald-500/20",
      icon: <Book className="text-teal-600" size={24} />,
      routes: [
        {
          title: "ヘルプセンター",
          path: "/help",
          desc: "ドキュメントとサポートの総合案内ポータル。",
          badge: "Support",
        },
        {
          title: "用語集 (Glossary)",
          path: "/help/glossary",
          desc: "オアシス宣言など根幹概念の解説。",
        },
        {
          title: "よくある質問 (FAQ)",
          path: "/help/faq",
          desc: "基本的な使い方や困った時の解決方法。",
        },
      ],
    },
    {
      title: "🧪 ラボ & アーカイブ",
      description: "実験的機能とレガシーページ",
      color: "from-zinc-500/20 to-slate-500/20",
      icon: <FlaskConical className="text-zinc-500" size={24} />,
      routes: [
        {
          title: "プロダクトリスト",
          path: "/product-list",
          desc: "Shop機能等のための製品表示デモ。",
        },
        {
          title: "旧 曼荼羅チャート",
          path: "/tools/mandala-chart",
          desc: "旧形式の曼荼羅チャート（互換用）。",
        },
        {
          title: "ランディングページ",
          path: "/landing-page",
          desc: "VNSプロジェクト全体のトップビューページ。",
        },
        {
          title: "レガシー・プロフィール",
          path: "/user-profiles/new-legacy",
          desc: "従来のプロフィール作成フォーム（参照用）。",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 p-8 dark:bg-[#020204] font-sans transition-colors duration-500">
      <main className="container mx-auto space-y-16 max-w-7xl">
        {/* ヒーローセクション */}
        <section className="flex flex-col items-center gap-8 text-center py-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12 hover:rotate-0 transition-transform duration-500">
              <Zap className="text-white" size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter italic uppercase text-neutral-900 dark:text-white">
              VNS <span className="text-indigo-500">Portal</span>
            </h1>
          </div>
          <p className="text-xl text-neutral-500 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed">
            価値観マッチングサイト「VNS」の開発・検証用ポータル。
            <br />
            全ての機能へのアクセスと検証をここから開始します。
          </p>
          <div className="flex gap-6 mt-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-12 py-8 text-lg font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/login">AUTH CONSOLE</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl px-12 py-8 text-lg font-bold border-2 border-neutral-200 dark:border-zinc-800 transition-all hover:bg-neutral-50 dark:hover:bg-zinc-900"
            >
              <Link
                href="https://github.com/masakinihirota/vns-masakinihirota"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3"
              >
                <span>REPOSITORY</span>
                <ChevronRight size={20} />
              </Link>
            </Button>
          </div>
        </section>

        {/* グリッドセクション */}
        <div className="space-y-24 pb-32">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 dark:border-zinc-800 pb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-br ${section.color}`}
                    >
                      {section.icon}
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-lg text-neutral-500 dark:text-zinc-400 font-medium">
                    {section.description}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Badge
                    variant="outline"
                    className="text-xs font-bold tracking-widest uppercase border-neutral-300 dark:border-zinc-700 text-neutral-400"
                  >
                    Category 0{idx + 1}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.routes.map((route, rIdx) => (
                  <Card
                    key={rIdx}
                    className="group relative overflow-hidden border-none bg-white dark:bg-[#09090b] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-[2.5rem]"
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500`}
                    />

                    <CardHeader className="relative z-10 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <CardTitle className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                          {route.title}
                        </CardTitle>
                        {route.badge && (
                          <Badge className="bg-indigo-600 text-white font-black rounded-full px-4 py-1 text-[10px] tracking-widest uppercase shadow-lg shadow-indigo-600/30">
                            {route.badge}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 p-8 pt-0">
                      <p className="text-base text-neutral-500 dark:text-zinc-500 font-medium leading-relaxed mb-8 min-h-[60px]">
                        {route.desc}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full flex justify-between bg-neutral-50 dark:bg-zinc-950/50 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-2xl py-6 px-6 font-black transition-all group"
                      >
                        <Link href={route.path}>
                          <span>OPEN PAGE</span>
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
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
