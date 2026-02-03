"use client";

import {
  ArrowRight,
  Globe,
  Handshake,
  Home as HomeIcon,
  Layers,
  Navigation,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * 開発用ポータルダッシュボード
 * 全てのアプリ内ルートを網羅し、整理して表示します。
 */
export function PortalDashboard() {
  const sections = [
    {
      title: "🚀 メイン機能",
      description: "アプリケーションの核心となる主要機能",
      color: "from-blue-500/20 to-indigo-500/20",
      icon: <HomeIcon className="text-blue-500" size={24} />,
      routes: [
        {
          title: "ホーム (スタート)",
          path: "/home",
          desc: "ログイン後のメインランディングページ。",
          badge: "Core",
          isRetired: false,
        },
        {
          title: "マッチングハブ",
          path: "/matching",
          desc: "マッチング機能の起点となる画面。",
          badge: "Core",
          isRetired: false,
        },
        {
          title: "作品リスト",
          path: "/works",
          desc: "登録された作品の一覧表示。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "プロフィール",
          path: "/profile",
          desc: "自身のユーザープロフィールの確認と編集。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🔑 ルートアカウント",
      description: "システム管理とユーザー基盤",
      color: "from-red-500/20 to-rose-500/20",
      icon: <UserPlus className="text-red-500" size={24} />,
      routes: [
        {
          title: "ルートアカウント管理",
          path: "/root-accounts",
          desc: "作成済みのルートアカウント一覧と管理。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "アカウント新規作成",
          path: "/root-accounts/create",
          desc: "新しいルートアカウントを手動で作成。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🔰 オンボーディング",
      description: "新規登録から初期設定までの体験フロー",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <Handshake className="text-emerald-500" size={24} />,
      routes: [
        {
          title: "体験版オンボーディング",
          path: "/onboarding-trial",
          desc: "ログイン不要で試せる簡易登録フロー。",
          badge: "Trial",
          isRetired: false,
        },
        {
          title: "ルートアカウント選択",
          path: "/onboarding/choice",
          desc: "初期の役割や種別を選択する3択画面。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "PCオンボーディング",
          path: "/onboarding-pc",
          desc: "PC版オンボーディング（ゲーミフィケーション）。",
          badge: "New",
          isRetired: false,
        },
        {
          title: "ログイン",
          path: "/login",
          desc: "システムの認証入り口。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🎛️ マッチング & 検索",
      description: "他者との繋がりを創出する様々な機能",
      color: "from-orange-500/20 to-rose-500/20",
      icon: <Search className="text-orange-500" size={24} />,
      routes: [
        {
          title: "オートマッチング",
          path: "/auto-matching",
          desc: "価値観に基づいた自動マッチング機能。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "マニュアルマッチング",
          path: "/matching/manual",
          desc: "条件を指定して手動で相手を探す機能。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "ユーザー一覧",
          path: "/user-profiles",
          desc: "システム内の他ユーザーを探索。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "作品登録フォーム",
          path: "/work-registration-form",
          desc: "新しい作品を登録するためのエディタ。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🎨 価値観 & デザイン",
      description: "自己表現とシステムの外観設定",
      color: "from-purple-500/20 to-fuchsia-500/20",
      icon: <Layers className="text-purple-500" size={24} />,
      routes: [
        {
          title: "価値観入力",
          path: "/values-input",
          desc: "自身のマインドセットを入力するフォーム。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "価値観選択",
          path: "/values-selection",
          desc: "提供された選択肢から価値観を選ぶ。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "プロフィールテーマ",
          path: "/profile-theme",
          desc: "プロフィールの表示デザインをカスタマイズ。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "テーマ・色彩設定",
          path: "/onboarding-trial/choice",
          desc: "体験版での色彩感度テストと選択。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🧠 分析 & シミュレーション",
      description: "自己内省や実験的なUI機能",
      color: "from-cyan-500/20 to-blue-500/20",
      icon: <Sparkles className="text-cyan-500" size={24} />,
      routes: [
        {
          title: "ホーム（体験版・非推奨）",
          path: "/home-trial",
          desc: "体験版用ホーム。検討の結果、作成中止となりました。",
          badge: undefined,
          isRetired: true,
        },
        {
          title: "マンダラチャート",
          path: "/mandala-chart",
          desc: "AIがサポートする思考整理ツール。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "マンダラ (Legacy)",
          path: "/mandala-chart-legacy",
          desc: "旧式のマンダラチャート実装。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "📖 公開ページ & PR",
      description: "未ログインでも閲覧可能なコンテンツ",
      color: "from-amber-500/20 to-yellow-500/20",
      icon: <Globe className="text-amber-500" size={24} />,
      routes: [
        {
          title: "ランディングページ",
          path: "/landing-page",
          desc: "VNSの魅力と機能を紹介するメインLP。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "オアシス宣言",
          path: "/oasis",
          desc: "コミュニティの理念とルールを明文化。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "ヒューマン・マニフェスト",
          path: "/human",
          desc: "人間中心のデザイン哲学を紹介。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "公式スピーチ",
          path: "/legendary-speech",
          desc: "創設者によるビジョンプレゼンテーション。",
          badge: undefined,
          isRetired: false,
        },
      ],
    },
    {
      title: "🧪 サンプル & デバッグ",
      description: "開発者向けの検証・補助ページ",
      color: "from-zinc-500/20 to-slate-500/20",
      icon: <Settings className="text-zinc-500" size={24} />,
      routes: [
        {
          title: "ヘルプセンター",
          path: "/help",
          desc: "FAQ、用語集、ディスカッションページへの入り口。",
          badge: undefined,
          isRetired: false,
        },
        {
          title: "開発者ダッシュボード",
          path: "/dev-dashboard",
          desc: "現在表示しているこのページ。",
          badge: "Current",
          isRetired: false,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0B0F1A] p-4 md:p-8 font-sans transition-colors duration-500">
      <main className="container mx-auto space-y-12 max-w-7xl">
        {/* ヒーローセクション - グラスモーフィズム適用 */}
        <section className="flex flex-col items-center gap-6 text-center py-12 md:py-20 relative overflow-hidden rounded-[3rem] bg-indigo-600/5 backdrop-blur-xl border border-indigo-500/10 mb-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="flex flex-col items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-12 hover:rotate-0 transition-transform duration-500 group">
              <Zap
                className="text-white group-hover:scale-110 transition-transform"
                size={40}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter text-neutral-900 dark:text-white uppercase italic">
                VNS{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  Portal
                </span>
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed bg-white/50 dark:bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20 dark:border-white/5">
                価値観マッチングサイト「VNS」開発・検証用リンク集
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/login">AUTH CONSOLE</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-bold bg-white/20 hover:bg-white/40 dark:bg-white/5 dark:hover:bg-white/10 backdrop-blur-md border-white/30 dark:border-white/10 transition-all hover:scale-105"
            >
              <Link href="/" className="flex items-center space-x-2">
                <span>VISIT SITE</span>
                <Navigation size={18} />
              </Link>
            </Button>
          </div>
        </section>

        {/* グリッドセクション */}
        <div className="space-y-20 pb-24">
          {sections.map((section, idx) => (
            <section
              key={idx}
              className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${section.color} border border-white/20 dark:border-white/5 shadow-inner`}
                    >
                      {section.icon}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base text-neutral-500 dark:text-zinc-400 font-medium ml-1">
                    {section.description}
                  </p>
                </div>
                <div className="hidden md:block">
                  <Badge
                    variant="secondary"
                    className="bg-neutral-200/50 dark:bg-white/5 border-none text-[10px] tracking-widest font-bold opacity-60"
                  >
                    CATEGORY {String(idx + 1).padStart(2, "0")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.routes.map((route, rIdx) => (
                  <Card
                    key={rIdx}
                    className={cn(
                      "group relative overflow-hidden transition-all duration-300 border border-white/40 dark:border-white/5 bg-white/60 dark:bg-white/[0.03] backdrop-blur-md shadow-sm rounded-[2rem]",
                      route.isRetired
                        ? "opacity-40 grayscale-[0.5]"
                        : "hover:-translate-y-1.5 hover:shadow-xl"
                    )}
                  >
                    <div
                      className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none`}
                    />

                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle
                          className={cn(
                            "text-lg md:text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200 transition-colors",
                            route.isRetired
                              ? "line-through decoration-red-500/50"
                              : "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                          )}
                        >
                          {route.title}
                        </CardTitle>
                        {route.badge && (
                          <Badge className="bg-indigo-600/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400 border-none px-2 py-0 text-[9px] font-bold tracking-tighter uppercase whitespace-nowrap">
                            {route.badge}
                          </Badge>
                        )}
                        {route.isRetired && (
                          <Badge
                            variant="destructive"
                            className="border-none px-2 py-0 text-[9px] font-bold tracking-tighter uppercase whitespace-nowrap opacity-100"
                          >
                            Retired
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0 space-y-6">
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-zinc-500 font-medium leading-relaxed min-h-[3rem]">
                        {route.desc}
                      </p>
                      <Button
                        asChild
                        variant="ghost"
                        className={cn(
                          "w-full h-11 flex justify-between bg-neutral-100/50 dark:bg-white/5 rounded-xl px-4 font-bold transition-all border border-transparent hover:border-white/20",
                          route.isRetired
                            ? "cursor-not-allowed pointer-events-none"
                            : "hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                        )}
                      >
                        <Link href={route.path}>
                          <span className="text-sm">
                            {route.isRetired ? "CLOSED" : "OPEN"}
                          </span>
                          {!route.isRetired && (
                            <ArrowRight
                              size={16}
                              className="group-hover:translate-x-1.5 transition-transform"
                            />
                          )}
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

      <footer className="container mx-auto max-w-7xl pt-8 pb-16 border-t border-neutral-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
          &copy; 2026 VNS Development Team - Premium Portal v2.0
        </p>
        <div className="flex gap-8 text-xs font-black tracking-tighter uppercase">
          <Link
            href="/help"
            className="hover:text-indigo-500 transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="https://github.com/masakinihirota/vns-masakinihirota"
            target="_blank"
            className="hover:text-indigo-500 transition-colors"
          >
            Repository
          </Link>
          <span className="text-neutral-400">Environment: Development</span>
        </div>
      </footer>
    </div>
  );
}
