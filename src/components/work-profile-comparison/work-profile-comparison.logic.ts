import {
  Activity,
  BookOpen,
  Clapperboard,
  History,
  Zap,
} from 'lucide-react';

/**
 * ティア定義
 */
export const TIERS = {
  T1: { label: 'T1', color: 'bg-amber-500', text: 'text-white', weight: 100 },
  T2: { label: 'T2', color: 'bg-slate-400', text: 'text-white', weight: 80 },
  T3: { label: 'T3', color: 'bg-amber-700', text: 'text-white', weight: 60 },
  NORMAL: { label: '普通', color: 'bg-slate-200', text: 'text-slate-600', weight: 20 },
  UNRATED: { label: '未評', color: 'bg-slate-100', text: 'text-slate-400', weight: 0 },
  INTERESTLESS: { label: '無関心', color: 'bg-slate-800', text: 'text-slate-400', weight: -20 },
};

export type TierKey = keyof typeof TIERS;

/**
 * カテゴリ定義
 */
export const CATEGORIES = {
  MANGA: { label: '漫画', icon: BookOpen, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  MOVIE: { label: '映画/アニメ', icon: Clapperboard, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  OTHER: { label: 'その他', icon: BookOpen, color: 'text-slate-600', bgColor: 'bg-slate-50' },
};

export type CategoryKey = keyof typeof CATEGORIES;

/**
 * 三世（時間軸）の定義
 */
export const TEMPORAL_AXIS = {
  LIFE: { label: '人生 (Past/Completed)', icon: History, color: 'text-blue-600', bgColor: 'bg-blue-50', desc: '完結・人生の基盤' },
  PRESENT: { label: '今 (Now/Ongoing)', icon: Activity, color: 'text-red-600', bgColor: 'bg-red-50', desc: '現在連載中・視聴中' },
  FUTURE: { label: '未来 (Future/Expect)', icon: Zap, color: 'text-amber-600', bgColor: 'bg-amber-50', desc: '発売予定・期待作' },
};

export type TemporalAxisKey = keyof typeof TEMPORAL_AXIS;

/**
 * 作品カタログの定義
 */
export interface WorkInfo {
  cat: CategoryKey;
  axis: TemporalAxisKey;
}

export const WORK_CATALOG: Record<string, WorkInfo> = {
  "ヒストリエ": { cat: "MANGA", axis: "PRESENT" },
  "チ。―地球の運動について―": { cat: "MANGA", axis: "LIFE" },
  "攻殻機動隊": { cat: "MOVIE", axis: "LIFE" },
  "マネーボール": { cat: "MOVIE", axis: "LIFE" },
  "インセプション": { cat: "MOVIE", axis: "LIFE" },
  "テネット": { cat: "MOVIE", axis: "LIFE" },
  "BLUE GIANT": { cat: "MANGA", axis: "LIFE" },
  "ダンダダン": { cat: "MANGA", axis: "PRESENT" },
  "ルックバック": { cat: "MOVIE", axis: "LIFE" },
  "プロジェクト・ヘイル・メアリー": { cat: "MOVIE", axis: "FUTURE" },
  "HUNTER×HUNTER": { cat: "MANGA", axis: "PRESENT" },
};

/**
 * プロフィール定義
 */
export interface Profile {
  id: string | number;
  name: string;
  role: string;
  values: string[];
  ratings: Record<string, TierKey>;
}

export interface ComparisonItem {
  title: string;
  category: CategoryKey;
  axis: TemporalAxisKey;
  myTier: TierKey;
  theirTier: TierKey | null;
  score: number;
}

export interface SortConfig {
  key: 'title' | 'heat';
  direction: 'asc' | 'desc';
}

/**
 * シンクロ率（Match Factor）の算出アルゴリズム
 *
 * 仕様:
 * - 基礎点: 60%
 * - 自分と相手が同じ作品に対し同じティアを付けている場合、+15ポイント
 * - 最大 99%
 * - 未評価同士は加点対象外
 */
export function calculateSyncLevel(myProfile: Profile, targetProfile: Profile | null): number | null {
  if (!targetProfile) return null;

  const allWorkTitles = Array.from(
    new Set([...Object.keys(myProfile.ratings), ...Object.keys(targetProfile.ratings)])
  );

  let matchPoints = 0;
  allWorkTitles.forEach((title) => {
    const myRating = myProfile.ratings[title];
    const targetRating = targetProfile.ratings[title];

    if (myRating && targetRating && myRating === targetRating) {
      matchPoints += 15;
    }
  });

  return Math.min(99, 60 + matchPoints);
}

/**
 * 比較データの生成
 */
export function generateComparisonData(
  myProfile: Profile,
  targetProfile: Profile | null,
  filters: {
    tier: Record<TierKey, boolean>;
    category: Record<CategoryKey, boolean>;
    temporal: Record<TemporalAxisKey, boolean>;
  },
  sort: SortConfig
): ComparisonItem[] {
  const allWorkTitles = Array.from(
    new Set([
      ...Object.keys(myProfile.ratings),
      ...(targetProfile ? Object.keys(targetProfile.ratings) : []),
    ])
  );

  let data: ComparisonItem[] = allWorkTitles.map((title) => {
    const info = WORK_CATALOG[title] ?? { cat: 'OTHER', axis: 'LIFE' };
    const myTier = myProfile.ratings[title] ?? 'UNRATED';
    const theirTier = targetProfile ? (targetProfile.ratings[title] ?? 'UNRATED') : null;

    const myWeight = TIERS[myTier]?.weight ?? 0;
    const theirWeight = theirTier ? (TIERS[theirTier]?.weight ?? 0) : 0;

    return {
      title,
      category: info.cat,
      axis: info.axis,
      myTier,
      theirTier,
      score: myWeight + theirWeight,
    };
  });

  // フィルタリング
  data = data.filter((item) => {
    const tierVisible = filters.tier[item.myTier] || (item.theirTier && filters.tier[item.theirTier]);
    const categoryVisible = filters.category[item.category];
    const temporalVisible = filters.temporal[item.axis];
    return tierVisible && categoryVisible && temporalVisible;
  });

  // ソート
  const multiplier = sort.direction === 'asc' ? 1 : -1;
  data.sort((a, b) => {
    let comp = 0;
    if (sort.key === 'title') {
      comp = a.title.localeCompare(b.title, 'ja');
    } else {
      comp = a.score - b.score;
    }
    return comp * multiplier;
  });

  return data;
}

/**
 * 候補者のモックデータ
 */
export const CANDIDATES: Profile[] = [
  {
    id: 1,
    name: "佐藤 匠",
    role: "Full Stack Engineer",
    values: ["技術探求", "効率性", "オープンソース"],
    ratings: {
      "ヒストリエ": "T1",
      "攻殻機動隊": "T1",
      "チ。―地球の運動について―": "T2",
      "HUNTER×HUNTER": "T1",
      "プロジェクト・ヘイル・メアリー": "T1",
    }
  },
  {
    id: 2,
    name: "田中 美咲",
    role: "UI/UX Designer",
    values: ["美学", "論理的思考", "共感"],
    ratings: {
      "ルックバック": "T1",
      "BLUE GIANT": "T1",
      "ダンダダン": "T1",
      "攻殻機動隊": "INTERESTLESS",
    }
  }
];

export const MY_PROFILES: Profile[] = [
  {
    id: 'pm',
    name: "ケンジ (PM)",
    role: "IT PM / Rationalist",
    values: ["効率性", "論理的思考", "自律"],
    ratings: {
      "ヒストリエ": "T1",
      "チ。―地球の運動について―": "T1",
      "攻殻機動隊": "T1",
      "マネーボール": "T1",
      "ダンダダン": "T2",
      "プロジェクト・ヘイル・メアリー": "T1",
      "HUNTER×HUNTER": "T1",
    }
  },
  {
    id: 'creator',
    name: "ケンジ (Creator)",
    role: "Indie Developer / Artist",
    values: ["創造性", "直感", "審美眼"],
    ratings: {
      "BLUE GIANT": "T1",
      "攻殻機動隊": "T1",
      "インセプション": "T1",
      "ルックバック": "T1",
      "ダンダダン": "T1",
    }
  }
];
