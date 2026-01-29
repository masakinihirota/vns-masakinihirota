"use client";

import {
  Home as HomeIcon,
  Zap,
  Handshake,
  FlaskConical,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PortalDashboard() {
  const sections = [
    {
      title: "🚀 Main Features",
      description: "アプリケーションの主要機能",
      color: "from-blue-500/20 to-cyan-500/20",
      icon: <HomeIcon className="text-blue-500" size={24} />,
      routes: [
        {
          title: "Home (Portal)",
          path: "/home",
          desc: "メインのポータル画面。",
          badge: "Core",
        },
        {
          title: "Matching",
          path: "/matching",
          desc: "マッチングハブ画面。",
          badge: "Core",
        },
        {
          title: "Works List",
          path: "/works",
          desc: "作品リスト閲覧。",
        },
        {
          title: "User Profile",
          path: "/profile",
          desc: "ユーザープロフィール確認。",
        },
      ],
    },
    {
      title: "🔰 Onboarding & Registration",
      description: "新規登録とオンーボーディング体験",
      color: "from-green-500/20 to-emerald-500/20",
      icon: <Handshake className="text-green-500" size={24} />,
      routes: [
        {
          title: "簡易版 Onboarding (Trial)",
          path: "/onboarding-trial",
          desc: "PC/SP両対応の簡易版オンボーディング体験。",
          badge: "Lite",
        },
        {
          title: "PC Onboarding (Full)",
          path: "/onboarding-pc",
          desc: "没入型マップUIを使用したフル機能オンボーディング。",
          badge: "Full",
        },
        {
          title: "作品登録 (New UI)",
          path: "/work-registration-form",
          desc: "新しいUIでの作品登録フォーム。",
          badge: "Active",
        },
        {
          title: "Root Account Choice",
          path: "/onboarding/choice",
          desc: "ルートアカウント作成直後の3択画面。",
          badge: "New",
        },
      ],
    },
    {
      title: "🧪 Lab & Experiments",
      description: "実験的機能とプロトタイプ",
      color: "from-purple-500/20 to-pink-500/20",
      icon: <FlaskConical className="text-purple-500" size={24} />,
      routes: [
        {
          title: "Mandala Chart (AI)",
          path: "/sample/mandala-chart-ai",
          desc: "AIサポート付きマンダラチャート。",
          badge: "AI",
        },
        {
          title: "Ghost Page",
          path: "/ghost",
          desc: "ゴースト観測ページ（実験的UI）。",
          badge: "Beta",
        },
        {
          title: "Sample / UI Checks",
          path: "/sample",
          desc: "各種UIコンポーネントの動作確認。",
        },
      ],
    },
    {
      title: "⚙️ System & Auth",
      description: "システム管理と認証",
      color: "from-gray-500/20 to-slate-500/20",
      icon: <Zap className="text-gray-500" size={24} />,
      routes: [
        {
          title: "Login",
          path: "/login",
          desc: "ログイン画面。",
        },
        {
          title: "Developer Dashboard",
          path: "/dev-dashboard",
          desc: "このダッシュボード画面。",
          badge: "Meta",
        },
      ],
    },
    {
      title: "🧪 重複・サンプルページ確認",
      description: "整理対象（重複・バックアップ・未使用）の確認用リンク",
      color: "from-red-500/20 to-orange-500/20",
      icon: <FlaskConical className="text-red-500" size={24} />,
      routes: [
        {
          title: "マニュアルマッチング (1)",
          path: "/manual-matching",
          desc: "構成: src/app/(protected)/manual-matching",
          badge: "重複A",
        },
        {
          title: "マニュアルマッチング (2)",
          path: "/matching/manual",
          desc: "構成: src/app/(protected)/matching/manual",
          badge: "重複B",
        },
        {
          title: "マニュアルマッチング (3)",
          path: "/matching-manual",
          desc: "構成: src/app/(protected)/matching-manual",
          badge: "重複C",
        },
        {
          title: "オアシス宣言 (Final)",
          path: "/oasis",
          desc: "構成: src/app/(public)/oasis",
          badge: "Unified",
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
