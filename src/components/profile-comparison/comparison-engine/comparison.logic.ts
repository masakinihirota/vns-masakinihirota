import {
  Activity,
  BookOpen,
  Clapperboard,
  History,
  LucideIcon,
  Zap,
} from "lucide-react";

/**
 * 作品のティア（評価レベル）定義
 */
export const TIERS = {
  T1: { label: "T1", color: "bg-amber-500", text: "text-white", weight: 100 },
  T2: { label: "T2", color: "bg-slate-400", text: "text-white", weight: 80 },
  T3: { label: "T3", color: "bg-amber-700", text: "text-white", weight: 60 },
  NORMAL: {
    label: "普通",
    color: "bg-slate-200",
    text: "text-slate-600",
    weight: 20,
  },
  UNRATED: {
    label: "未評",
    color: "bg-slate-100",
    text: "text-slate-400",
    weight: 0,
  },
  INTERESTLESS: {
    label: "無関心",
    color: "bg-slate-800",
    text: "text-slate-400",
    weight: -20,
  },
} as const;

export type TierKey = keyof typeof TIERS;

/**
 * 作品カテゴリ定義
 */
export const CATEGORIES: Record<string, CategoryInfo> = {
  MANGA: {
    label: "漫画",
    icon: BookOpen,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  MOVIE: {
    label: "映画/アニメ",
    icon: Clapperboard,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  OTHER: {
    label: "その他",
    icon: BookOpen,
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export interface CategoryInfo {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly bgColor: string;
}

/**
 * 三世（時間軸・Epoch）定義
 */
export const TEMPORAL_AXIS: Record<string, AxisInfo> = {
  LIFE: {
    label: "人生 (Past/Completed)",
    icon: History,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    desc: "完結・人生の基盤",
  },
  PRESENT: {
    label: "今 (Now/Ongoing)",
    icon: Activity,
    color: "text-red-600",
    bgColor: "bg-red-50",
    desc: "現在連載中・視聴中",
  },
  FUTURE: {
    label: "未来 (Future/Expect)",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    desc: "発売予定・期待作",
  },
} as const;

export type AxisKey = keyof typeof TEMPORAL_AXIS;

export interface AxisInfo {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly color: string;
  readonly bgColor: string;
  readonly desc: string;
}

/**
 * 作品カタログ情報
 */
export const WORK_CATALOG: Record<string, WorkInfo> = {
  ヒストリエ: { cat: "MANGA", axis: "PRESENT" },
  "チ。―地球の運動について―": { cat: "MANGA", axis: "LIFE" },
  攻殻機動隊: { cat: "MOVIE", axis: "LIFE" },
  マネーボール: { cat: "MOVIE", axis: "LIFE" },
  インセプション: { cat: "MOVIE", axis: "LIFE" },
  テネット: { cat: "MOVIE", axis: "LIFE" },
  "BLUE GIANT": { cat: "MANGA", axis: "LIFE" },
  ダンダダン: { cat: "MANGA", axis: "PRESENT" },
  ルックバック: { cat: "MOVIE", axis: "LIFE" },
  "プロジェクト・ヘイル・メアリー": { cat: "MOVIE", axis: "FUTURE" },
  "HUNTER×HUNTER": { cat: "MANGA", axis: "PRESENT" },
} as const;

/**
 * プロファイル型定義
 */
export interface Profile {
  readonly id: string | number;
  readonly name: string;
  readonly role: string;
  readonly values: readonly string[];
  readonly ratings: Record<string, TierKey>;
}

/**
 * 作品カタログ情報
 */
export interface WorkInfo {
  readonly cat: CategoryKey;
  readonly axis: AxisKey;
}

/**
 * インタラクション状態
 */
export interface UserInteraction {
  readonly watched: boolean;
  readonly followed: boolean;
}

/**
 * 比較用データ行の型
 */
export interface ComparisonItem {
  readonly title: string;
  readonly category: CategoryKey;
  readonly axis: AxisKey;
  readonly myTier: TierKey;
  readonly theirTier: TierKey | null;
  readonly score: number;
}

/**
 * フィルタ設定の型
 */
export interface FilterConfig {
  readonly tier: Record<TierKey, boolean>;
  readonly cat: Record<CategoryKey, boolean>;
  readonly temporal: Record<AxisKey, boolean>;
}

/**
 * ソート設定の型
 */
export interface SortConfig {
  readonly key: "title" | "heat";
  readonly direction: "asc" | "desc";
}

/**
 * 同調分析（Sync Level）を算出する。
 * 仕様：基礎点60% + 一致作品1件につき15%。最大99%。
 */
export const calculateSyncLevel = (
  me: Profile,
  target: Profile | null
): number => {
  if (!target) return 0;

  const allWorkTitles = Array.from(
    new Set([...Object.keys(me.ratings), ...Object.keys(target.ratings)])
  );

  let matchPoints = 0;
  allWorkTitles.forEach((title) => {
    const myRating = me.ratings[title];
    const theirRating = target.ratings[title];

    // 両者が評価しており、かつ一致している場合のみ加点
    if (myRating !== undefined && myRating === theirRating) {
      matchPoints += 15;
    }
  });

  return Math.min(99, 60 + matchPoints);
};

/**
 * 比較用データを生成、フィルタリング、ソートする。
 */
export const generateComparisonData = (
  me: Profile,
  target: Profile | null,
  sort: SortConfig,
  filters: FilterConfig
): ComparisonItem[] => {
  const allWorkTitles = Array.from(
    new Set([
      ...Object.keys(me.ratings),
      ...(target ? Object.keys(target.ratings) : []),
    ])
  );

  let data = allWorkTitles.map((title): ComparisonItem => {
    const catalog = WORK_CATALOG[title] || { cat: "OTHER", axis: "LIFE" };
    const myTier = me.ratings[title] || "UNRATED";
    const theirTier = target ? target.ratings[title] || "UNRATED" : null;

    const myWeight = TIERS[myTier]?.weight || 0;
    const theirWeight = theirTier ? TIERS[theirTier]?.weight || 0 : 0;

    return {
      title,
      category: catalog.cat,
      axis: catalog.axis,
      myTier,
      theirTier,
      score: myWeight + theirWeight,
    };
  });

  // フィルタリング
  data = data.filter((item) => {
    const isTierVisible =
      filters.tier[item.myTier] ||
      (item.theirTier && filters.tier[item.theirTier]);
    const isCatVisible = filters.cat[item.category];
    const isTemporalVisible = filters.temporal[item.axis];

    return isTierVisible && isCatVisible && isTemporalVisible;
  });

  // ソート
  const multiplier = sort.direction === "asc" ? 1 : -1;
  data.sort((a, b) => {
    if (sort.key === "title") {
      return a.title.localeCompare(b.title) * multiplier;
    }
    return (a.score - b.score) * multiplier;
  });

  return data;
};
