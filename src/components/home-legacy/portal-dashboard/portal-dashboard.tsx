"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Circle,
  Globe,
  Handshake,
  Home as HomeIcon,
  Layers,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface RouteItem {
  title: string;
  path: string;
  desc: string;
  badge?: string;
  isRetired?: boolean;
}

type RoadmapStatus = "todo" | "done" | "focus";

export function PortalDashboard() {
  const [routeStatuses, setRouteStatuses] = useState<
    Record<string, RoadmapStatus>
  >({});
  const [routeOrder, setRouteOrder] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const allSections = [
    {
      title: "🚀 メイン機能",
      icon: <HomeIcon size={20} />,
      color: "text-blue-500",
      routes: [
        {
          title: "ホーム (スタート)",
          path: "/home",
          desc: "ログイン後のメインランディングページ。",
        },
        {
          title: "マッチングハブ",
          path: "/matching",
          desc: "マッチング機能の起点となる画面。",
        },
        {
          title: "作品リスト",
          path: "/works",
          desc: "登録された作品の一覧表示。",
        },
        {
          title: "作品管理リスト",
          path: "/work-list",
          desc: "詳細な作品管理インターフェース。",
        },
        {
          title: "プロフィール",
          path: "/profile",
          desc: "自身のプロフィールの確認と編集。",
        },
        {
          title: "プロフィール表示 (New)",
          path: "/profile-display",
          desc: "【新規】Glassmorphismを採用した新プロフィール表示画面。",
        },
        {
          title: "国家ダッシュボード",
          path: "/nation",
          desc: "国の運営、市場、銀行などの統合管理。",
        },
        {
          title: "グループ UI",
          path: "/groups",
          desc: "グループ（プラザ・評価・価値観・スキル・管理）の統合画面。",
        },
        {
          title: "グループ詳細 (サンプルID)",
          path: "/groups/sample-id",
          desc: "特定のグループの詳細・管理画面（ID指定）。",
        },
        {
          title: "プロフィールマスク (Demo)",
          path: "/profile-mask-demo",
          desc: "【デモ】プロフィールマスク（多面性プロフィール）作成画面。",
        },
      ],
    },
    {
      title: "🔑 ルートアカウント",
      icon: <UserPlus size={20} />,
      color: "text-red-500",
      routes: [
        {
          title: "ルートアカウント管理",
          path: "/root-accounts",
          desc: "作成済みのルートアカウント一覧。",
        },
        {
          title: "アカウント新規作成",
          path: "/root-accounts/create",
          desc: "新しいアカウントを手動で作成。",
        },
      ],
    },
    {
      title: "🔰 オンボーディング",
      icon: <Handshake size={20} />,
      color: "text-emerald-500",
      routes: [
        {
          title: "体験版オンボーディング",
          path: "/onboarding-trial",
          desc: "ログイン不要で試せる簡易登録。",
        },
        {
          title: "ルートアカウント選択",
          path: "/onboarding/choice",
          desc: "初期の役割や種別を選択する3択画面。",
        },
        {
          title: "PCオンボーディング",
          path: "/onboarding-pc",
          desc: "PC版（ゲーミフィケーション）。",
        },
        {
          title: "一般オンボーディング",
          path: "/onboarding/normal",
          desc: "通常のユーザー登録フロー。",
        },
        { title: "ログイン", path: "/login", desc: "システムの認証入り口。" },
        {
          title: "Auth.js ログイン",
          path: "/authjs-login",
          desc: "Auth.js（GitHub/Google）を使用した新規認証画面。",
        },
      ],
    },
    {
      title: "🎛️ マッチング & 検索",
      icon: <Search size={20} />,
      color: "text-orange-500",
      routes: [
        {
          title: "オートマッチング (Legacy)",
          path: "/matching-auto",
          desc: "以前の自動マッチング実装。",
        },
        {
          title: "マニュアルマッチング",
          path: "/matching-manual",
          desc: "条件を指定して手動で相手を探す。",
        },
        {
          title: "ユーザー一覧",
          path: "/user-profiles",
          desc: "システム内の他ユーザーを探索。",
        },

        {
          title: "ユーザー編集 (ID指定)",
          path: "/user-profiles/1/edit",
          desc: "個別ユーザーの編集画面。IDはサンプルとして1を指定。",
        },
        {
          title: "ユーザーカード (サンプル)",
          path: "/user-profiles/1/card",
          desc: "個別ユーザーの名刺表示画面。",
        },
        {
          title: "作品登録フォーム",
          path: "/work-registration-form",
          desc: "新しい作品を登録するためのエディタ。",
        },
        {
          title: "新規作品登録",
          path: "/works/new",
          desc: "作品の新規作成画面。",
        },
        {
          title: "作品評価シミュレーター",
          path: "/works/continuous-rating",
          desc: "継続的な評価入力。",
        },
        {
          title: "プロダクトリスト",
          path: "/product-list",
          desc: "提供可能なプロダクトの一覧。",
        },
        {
          title: "ユーザー一覧（編集）",
          path: "/user-edited-userprofiles",
          desc: "編集可能なプロフィール一覧。",
        },
        {
          title: "ユーザー作成",
          path: "/user-profiles/new",
          desc: "新規プロフィールの作成。",
        },
      ],
    },
    {
      title: "🎨 価値観 & デザイン",
      icon: <Layers size={20} />,
      color: "text-purple-500",
      routes: [
        {
          title: "価値観入力",
          path: "/values-input",
          desc: "自身のマインドセットを入力。",
        },
        {
          title: "価値観選択",
          path: "/values-selection",
          desc: "提供された選択肢から選ぶ。",
        },
        {
          title: "プロフィールテーマ",
          path: "/profile-theme",
          desc: "プロフィールの表示デザインを調整。",
        },
        {
          title: "テーマ・色彩設定",
          path: "/onboarding-trial/choice",
          desc: "体験版での色彩感度テスト。",
        },
        {
          title: "価値観管理",
          path: "/values",
          desc: "登録済み価値観の管理。",
        },
      ],
    },
    {
      title: "🧠 分析 & シミュレーション",
      icon: <Sparkles size={20} />,
      color: "text-cyan-500",
      routes: [
        {
          title: "マンダラチャート (Trial)",
          path: "/home-trial/mandala",
          desc: "【最新】お試し体験版マンダラ。",
        },
        {
          title: "マンダラチャート (Public)",
          path: "/mandala-chart",
          desc: "一般公開用の基本マンダラチャート。",
        },
        {
          title: "体験版プロフィール作成",
          path: "/user-profiles-trial/new",
          desc: "ログイン不要で試せるプロフィール作成。",
        },
        {
          title: "ホーム（お試し体験）",
          path: "/home-trial",
          desc: "トライアル用のhome画面。",
        },
      ],
    },
    {
      title: "📖 公開ページ & PR",
      icon: <Globe size={20} />,
      color: "text-amber-500",
      routes: [
        {
          title: "ランディングページ",
          path: "/landing-page",
          desc: "VNSを紹介するメインLP。",
        },
        {
          title: "ヒューマン・マニフェスト",
          path: "/human",
          desc: "デザイン哲学を紹介。",
        },
        {
          title: "オアシス宣言",
          path: "/oasis",
          desc: "コミュニティの理念とルール。",
        },
        {
          title: "公式スピーチ",
          path: "/legendary-speech",
          desc: "ビジョンプレゼンテーション。",
        },
        {
          title: "お問い合わせ",
          path: "/contact",
          desc: "サイト運営への連絡フォーム。",
        },
        {
          title: "孤独対策宣言",
          path: "/global-loneliness-measures",
          desc: "孤独問題へのアプローチ。",
        },
        {
          title: "Sanibonani",
          path: "/sanibonani",
          desc: "アフリカ哲学のウェルカムページ。",
        },
        {
          title: "Good Life",
          path: "/good-life",
          desc: "良き人生のための指針。",
        },
        {
          title: "利用規約",
          path: "/terms-service",
          desc: "サービスの利用規約。",
        },
      ],
    },
    {
      title: "🧪 サンプル & デバッグ",
      icon: <Settings size={20} />,
      color: "text-zinc-500",
      routes: [
        {
          title: "ヘルプセンター (Top)",
          path: "/help",
          desc: "総合ヘルプポータル。",
        },
        { title: "FAQ", path: "/help/faq", desc: "よくある質問集。" },
        {
          title: "用語集",
          path: "/help/glossary",
          desc: "VNS独自の用語解説。",
        },
        {
          title: "トラブル対応集",
          path: "/help/trouble",
          desc: "ネットトラブルのレベル別対応ガイド。",
        },
        {
          title: "ディスカッション",
          path: "/help/discussion",
          desc: "コミュニティの議論場。",
        },
        {
          title: "チュートリアルポータル (Top)",
          path: "/tutorial",
          desc: "使い方の総合ガイド。",
        },
        {
          title: "基本チュートリアル",
          path: "/tutorial/basic",
          desc: "初心者向けのステップ。",
        },
        {
          title: "ドキュメントガイド",
          path: "/tutorial/docs",
          desc: "文書作成のルール。",
        },
        {
          title: "チュートリアル・ヘルプ",
          path: "/tutorial/help",
          desc: "個別ヘルプ。チュートリアル内の案内。",
        },
        {
          title: "開発者ダッシュボード",
          path: "/dev-dashboard",
          desc: "現在のページ。",
        },
      ],
    },
  ];

  // 全ルートをフラットな配列として取得
  const flattenedRoutes = allSections.flatMap((s) =>
    s.routes.map((r) => ({ ...r, sectionTitle: s.title }))
  );

  // 初回読み込み
  useEffect(() => {
    const savedStatuses = localStorage.getItem("vns_portal_statuses");
    const savedOrder = localStorage.getItem("vns_portal_order");

    if (savedStatuses) {
      setRouteStatuses(JSON.parse(savedStatuses));
    }

    const defaultOrder = flattenedRoutes.map((r) => r.path);
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder) as string[];
      // 既存の順序にない新しいルートがあれば末尾に追加
      const missingRoutes = defaultOrder.filter(
        (path) => !parsedOrder.includes(path)
      );
      setRouteOrder([...parsedOrder, ...missingRoutes]);
    } else {
      setRouteOrder(defaultOrder);
    }
    setIsLoaded(true);
  }, []);

  // 永続化
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "vns_portal_statuses",
        JSON.stringify(routeStatuses)
      );
    }
  }, [routeStatuses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vns_portal_order", JSON.stringify(routeOrder));
    }
  }, [routeOrder, isLoaded]);

  const setStatus = (path: string, status: RoadmapStatus) => {
    setRouteStatuses((prev) => ({
      ...prev,
      [path]: status,
    }));
  };

  const moveRoute = (index: number, direction: "up" | "down") => {
    const newOrder = [...routeOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[index],
    ];
    setRouteOrder(newOrder);
  };

  const resetAll = () => {
    if (confirm("全てのステータスをリセット（未着手に）しますか？")) {
      setRouteStatuses({});
    }
  };

  const resetOrder = () => {
    if (confirm("並び順をデフォルトに戻しますか？")) {
      setRouteOrder(flattenedRoutes.map((r) => r.path));
    }
  };

  // 表示用のルートリストを構築
  // 「注目」を最上位に、それ以外をカスタム順序で並べる
  const displayRoutes = useMemo(() => {
    const baseRoutes = routeOrder
      .map((path) => flattenedRoutes.find((r) => r.path === path))
      .filter(Boolean) as (RouteItem & { sectionTitle: string })[];

    const focusRoutes = baseRoutes.filter(
      (r) => routeStatuses[r.path] === "focus"
    );
    const otherRoutes = baseRoutes.filter(
      (r) => routeStatuses[r.path] !== "focus"
    );

    return [...focusRoutes, ...otherRoutes];
  }, [routeOrder, routeStatuses, flattenedRoutes]);

  const completedCount = Object.values(routeStatuses).filter(
    (s) => s === "done"
  ).length;
  const focusCount = Object.values(routeStatuses).filter(
    (s) => s === "focus"
  ).length;
  const progress = (completedCount / flattenedRoutes.length) * 100;

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0B0F1A] p-4 md:p-6 font-sans transition-colors duration-500">
      <main className="w-full space-y-6">
        {/* Header Section */}
        <section className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-white/20 dark:border-white/5 p-6 rounded-[2rem] shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase italic">
                VNS{" "}
                <span className="text-neutral-900 dark:text-neutral-100">
                  Roadmap
                </span>
              </h1>
              <p className="text-lg text-neutral-800 dark:text-neutral-200 font-medium">
                開発進捗管理（チェックシート形式）
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 min-w-[320px]">
              <div className="flex justify-between w-full text-lg font-bold uppercase tracking-widest px-1">
                <span className="text-neutral-900 dark:text-neutral-100">
                  Done: {completedCount}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  Focus: {focusCount}
                </span>
                <span className="text-neutral-900 dark:text-neutral-100">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress
                value={progress}
                className="h-3 w-full bg-neutral-200 dark:bg-white/20"
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAll}
                  className="h-10 text-lg uppercase font-black tracking-tighter hover:bg-neutral-200 dark:hover:bg-white/10"
                >
                  <RotateCcw size={16} className="mr-2" /> Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetOrder}
                  className="h-10 text-lg uppercase font-black tracking-tighter hover:bg-neutral-200 dark:hover:bg-white/10"
                >
                  <RotateCcw size={16} className="mr-2" /> Default Order
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Links List */}
        <div className="space-y-1 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[180px_1.5fr_1.5fr_auto] gap-6 px-6 py-4 bg-neutral-200/50 dark:bg-black/40 border-b border-white/10 text-lg font-black uppercase tracking-widest text-neutral-800 dark:text-neutral-100">
            <div className="text-center">Status</div>
            <div>Page Name / Description</div>
            <div className="hidden sm:block">Endpoint / URL</div>
            <div className="w-32 text-center">Order Control</div>
          </div>

          <div className="divide-y divide-neutral-200/50 dark:divide-white/5">
            {displayRoutes.map((route, idx) => {
              const status = routeStatuses[route.path] || "todo";
              const isDone = status === "done";
              const isFocus = status === "focus";

              return (
                <div
                  key={route.path}
                  className={cn(
                    "grid grid-cols-[180px_1.5fr_1.5fr_auto] gap-6 px-6 py-4 items-center transition-all group relative hover:bg-neutral-100 dark:hover:bg-white/10",
                    isDone &&
                    "bg-emerald-500/[0.08] dark:bg-emerald-500/[0.05]",
                    isFocus && "bg-amber-500/[0.1] dark:bg-amber-500/[0.08]"
                  )}
                >
                  {/* Absolute Clickable Overlay */}
                  <Link
                    href={route.path}
                    className="absolute inset-0 z-0"
                    aria-label={route.title}
                  />

                  <div className="flex items-center gap-2 w-[180px] justify-center relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "todo")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        status === "todo"
                          ? "bg-neutral-200 border-neutral-300 dark:bg-white/20 dark:border-white/30 text-neutral-600 dark:text-neutral-300"
                          : "border-transparent opacity-20 hover:opacity-100"
                      )}
                      title="未着手"
                    >
                      <Circle size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "done")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        isDone
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "border-transparent opacity-20 hover:opacity-100 text-emerald-600"
                      )}
                      title="完成"
                    >
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setStatus(route.path, "focus")}
                      className={cn(
                        "h-8 w-8 rounded-lg border transition-all",
                        isFocus
                          ? "bg-amber-500 border-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                          : "border-transparent opacity-20 hover:opacity-100 text-amber-500"
                      )}
                      title="注目"
                    >
                      <Zap size={16} fill={isFocus ? "white" : "none"} />
                    </Button>
                  </div>

                  <div className="space-y-0.5 relative z-10 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 transition-colors">
                        {route.title}
                      </span>
                      {route.isRetired && (
                        <Badge
                          variant="destructive"
                          className="px-3 py-1 text-lg font-black uppercase"
                        >
                          RETIRED
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-neutral-800 dark:text-neutral-200 leading-tight">
                      {route.sectionTitle} • {route.desc}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-lg font-medium text-neutral-900 dark:text-neutral-100 overflow-hidden relative z-10 pointer-events-none">
                    <code className="bg-neutral-200 dark:bg-neutral-800 px-3 py-1 rounded-md truncate border border-neutral-300 dark:border-neutral-600 font-bold">
                      {route.path}
                    </code>
                    <ArrowRight
                      size={20}
                      className="text-neutral-900 dark:text-neutral-100 ml-2"
                    />
                  </div>

                  <div className="flex gap-0.5 justify-center transition-opacity relative z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10"
                      disabled={idx === 0}
                      onClick={() => moveRoute(idx, "up")}
                    >
                      <ArrowUp size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10"
                      disabled={idx === displayRoutes.length - 1}
                      onClick={() => moveRoute(idx, "down")}
                    >
                      <ArrowDown size={18} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="w-full pt-10 pb-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6 mt-10 border-t-2 border-neutral-300 dark:border-neutral-700">
        <p className="text-lg font-bold tracking-widest text-neutral-900 dark:text-neutral-100 uppercase">
          &copy; 2026 VNS DevTools • List-Based Roadmap v1.0
        </p>
        <div className="flex gap-12 text-lg font-black tracking-tighter uppercase font-sans">
          <Link
            href="https://github.com/masakinihirota/vns-masakinihirota"
            target="_blank"
            className="text-neutral-900 dark:text-neutral-100 hover:scale-105 transition-transform"
          >
            Repository
          </Link>
          <span className="text-neutral-900 dark:text-neutral-100 border-b-2 border-indigo-500">
            Browser Storage Mode
          </span>
        </div>
      </footer>
    </div>
  );
}
