"use client";

import { Globe, Handshake, Home as HomeIcon, Layers, Search, Settings, Sparkles, UserPlus } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

/**
 * ルート項目の定義
 */
export interface RouteItem {
  /** ページタイトル */
  title: string;
  /** ページのパス（URL） */
  path: string;
  /** ページの説明 */
  desc: string;
  /** バッジ（New, Phase 4など） */
  badge?: string;
  /** 非推奨/廃止フラグ */
  isRetired?: boolean;
}

/**
 * ロードマップのステータス型
 */
export type RoadmapStatus = "todo" | "done" | "focus";

/**
 * セクションの定義
 */
export interface Section {
  title: string;
  icon: ReactNode;
  color: string;
  routes: RouteItem[];
}

/**
 * ダッシュボードの全セクションデータ
 */
export const ALL_SECTIONS: readonly Section[] = [
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
        badge: "Phase 5",
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
        title: "作品詳細 (サンプルID)",
        path: "/works/sample-id",
        desc: "作品の詳細表示画面。",
      },
      {
        title: "プロフィール",
        path: "/profile",
        desc: "自身のプロフィールの確認と編集。",
      },
      {
        title: "プロフィール表示",
        path: "/profile-display",
        desc: "【新規】Glassmorphismを採用した新プロフィール表示画面。",
        badge: "New",
      },
      {
        title: "国家ダッシュボード",
        path: "/nations",
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
        title: "報酬・ポイント",
        path: "/rewards",
        desc: "【新規】ポイント獲得履歴と報酬受け取り。",
        badge: "New",
      },
      {
        title: "プロフィール作成 (1000 Masks)",
        path: "/profile/creation-1000masks",
        desc: "千の仮面を作成・管理する新プロフィール作成フロー。",
        badge: "New",
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
    ],
  },
  {
    title: "🎛️ マッチング & 検索",
    icon: <Search size={20} />,
    color: "text-orange-500",
    routes: [
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
      {
        title: "マーケット",
        path: "/market",
        desc: "アイテムの売買・取引。",
        badge: "Phase 4",
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
      {
        title: "アイデンティティ可視化",
        path: "/identity",
        desc: "アカウントとプロフィールの関係を視覚化します。",
        badge: "New",
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
      {
        title: "体験版プロフィール作成 (1000 Masks)",
        path: "/home-trial/profile",
        desc: "体験版用のプロフィール作成フロー（LocalStorage保存）。",
        badge: "New",
      },
      {
        title: "スキル比較マンダラ",
        path: "/skill-comparison",
        desc: "ユーザーと候補者のスキル習熟度を3x3のマンダラチャートで比較分析。",
        badge: "New",
      },
      {
        title: "スキル同期",
        path: "/skill-sync",
        desc: "【新規】スキル情報の同期・連携機能。",
        badge: "New",
      },
      {
        title: "プロフィール比較",
        path: "/comparison",
        desc: "複数の自己プロファイルと候補者プロファイルを作品軸で比較分析。",
        badge: "New",
      },
    ],
  },
  {
    title: "📖 公開ページ & PR",
    icon: <Globe size={20} />,
    color: "text-amber-500",
    routes: [
      {
        title: "公式サイト (TOP)",
        path: "/",
        desc: "サイトのルート（ランディングページ）。",
        badge: "Home",
      },
      {
        title: "ランディングページ",
        path: "/landing-page",
        desc: "VNSを紹介するメインLP。",
      },
      {
        title: "価値観サイトのコンセプト",
        path: "/concept",
        desc: "幽霊（匿名）から実体へ、サイトの根幹概念を説明するページ。",
        badge: "New",
      },
      {
        title: "オアシス宣言",
        path: "/oasis",
        desc: "コミュニティの理念とルール。",
      },
      {
        title: "ヒューマン・マニフェスト",
        path: "/human",
        desc: "デザイン哲学を紹介。",
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
        title: "グループと国の説明",
        path: "/group-nation-explanation",
        desc: "VNSにおける「グループ」と「国」の概念を対比して説明します。",
        badge: "New",
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
        desc: "現在の進捗管理画面。",
      },
    ],
  },
  {
    title: "�️ 管理パネル",
    icon: <Settings size={20} />,
    color: "text-red-500",
    routes: [
      {
        title: "管理パネル (HOME)",
        path: "/admin",
        desc: "システム管理者向けダッシュボード。KPI統計、ユーザー検索、ペナルティ管理。",
        badge: "Admin Only",
      },
      {
        title: "ユーザー管理",
        path: "/admin/accounts",
        desc: "ユーザーの検索・フィルタリング・ロール変更・ペナルティ発行。",
      },
      {
        title: "ペナルティ管理",
        path: "/admin/penalties",
        desc: "ペナルティの履歴表示と新規発行。優先度順ソート。",
      },
      {
        title: "作品承認キュー",
        path: "/admin/approvals",
        desc: "待機中の作品を一覧表示・承認/却下処理。",
      },
      {
        title: "監査ログ検索",
        path: "/admin/audit",
        desc: "全管理操作の監査ログを検索・表示。",
      },
    ],
  },
  {
    title: "�🛠️ Design System (DADS)",
    icon: <Settings size={20} />,
    color: "text-slate-500",
    routes: [
      {
        title: "Button",
        path: "/dads/button",
        desc: "デジタル庁デザインシステムのボタンコンポーネント。",
      },
      {
        title: "Input",
        path: "/dads/input",
        desc: "デジタル庁デザインシステムの入力フィールド。",
      },
      {
        title: "DADS 参考実装 (全種)",
        path: "/dads-reference",
        desc: "DADS準拠の各コンポーネント（Checkbox, Radio, Select等）の参照用実装。",
        badge: "Reference",
      },
    ],
  },
] as const;

/**
 * ダッシュボードのロジックを管理するカスタムフック
 */
export function usePortalDashboard() {
  const [routeStatuses, setRouteStatuses] = useState<Record<string, RoadmapStatus>>({});
  const [routeOrder, setRouteOrder] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 全ルートをフラットな配列として取得
  const flattenedRoutes = useMemo(
    () =>
      ALL_SECTIONS.flatMap((s) =>
        s.routes.map((r) => ({ ...r, sectionTitle: s.title }))
      ),
    []
  );

  // 初回読み込み
  useEffect(() => {
    const savedStatuses = localStorage.getItem("vns_portal_statuses");
    const savedOrder = localStorage.getItem("vns_portal_order");

    if (savedStatuses) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
  }, [flattenedRoutes]);

  // 永続化
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vns_portal_statuses", JSON.stringify(routeStatuses));
    }
  }, [routeStatuses, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vns_portal_order", JSON.stringify(routeOrder));
    }
  }, [routeOrder, isLoaded]);

  const setStatus = (path: string, status: RoadmapStatus) => {
    setRouteStatuses((previous) => ({
      ...previous,
      [path]: status,
    }));
  };

  const moveRoute = (index: number, direction: "up" | "down") => {
    const newOrder = [...routeOrder];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
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
  const displayRoutes = useMemo(() => {
    const baseRoutes = routeOrder
      .map((path) => flattenedRoutes.find((r) => r.path === path))
      .filter(Boolean) as (RouteItem & { sectionTitle: string })[];

    const focusRoutes = baseRoutes.filter((r) => routeStatuses[r.path] === "focus");
    const otherRoutes = baseRoutes.filter((r) => routeStatuses[r.path] !== "focus");

    return [...focusRoutes, ...otherRoutes];
  }, [routeOrder, routeStatuses, flattenedRoutes]);

  const completedCount = Object.values(routeStatuses).filter((s) => s === "done").length;
  const focusCount = Object.values(routeStatuses).filter((s) => s === "focus").length;
  const progress = flattenedRoutes.length > 0 ? (completedCount / flattenedRoutes.length) * 100 : 0;

  return {
    routeStatuses,
    routeOrder,
    isLoaded,
    setStatus,
    moveRoute,
    resetAll,
    resetOrder,
    displayRoutes,
    completedCount,
    focusCount,
    progress,
    totalCount: flattenedRoutes.length,
  };
}
