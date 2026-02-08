/**
 * 評価タイプの定義
 */
export const RATING_TYPES = {
  TIER1: "Tier1",
  TIER2: "Tier2",
  TIER3: "Tier3",
  NEUTRAL: "Neutral", // 普通 or 自分には合わなかった
  UNRATED: "Unrated", // 未評価
  INTERESTED_NONE: "InterestedNone", // 興味無し
} as const;

export type RatingType = (typeof RATING_TYPES)[keyof typeof RATING_TYPES];

/**
 * 評価のソート順序
 */
export const RATING_ORDER: Record<RatingType, number> = {
  [RATING_TYPES.TIER1]: 0,
  [RATING_TYPES.TIER2]: 1,
  [RATING_TYPES.TIER3]: 2,
  [RATING_TYPES.NEUTRAL]: 3,
  [RATING_TYPES.UNRATED]: 4,
  [RATING_TYPES.INTERESTED_NONE]: 5,
};

/**
 * プロフィール基本情報
 */
export interface Profile {
  readonly name: string;
  readonly headline: string;
  readonly status: string;
  readonly bio: string;
}

/**
 * 実績（作品）
 */
export interface Work {
  readonly id: number;
  readonly title: string;
  readonly category: string;
  readonly url: string;
  readonly rating: RatingType;
}

/**
 * お気に入りコンテンツ
 */
export interface Favorite {
  readonly id: number;
  readonly title: string;
  readonly subCategory: "Manga" | "Anime";
  readonly genre: string;
  readonly rating: RatingType;
}

/**
 * 価値観
 */
export interface CoreValue {
  readonly id: number;
  readonly key: string;
  readonly description: string;
  readonly rating: RatingType;
}

/**
 * スキル
 */
export interface Skill {
  readonly id: number;
  readonly name: string;
  readonly level: string;
  readonly category: string;
}

/**
 * アプリケーション全体のデータ構造
 */
export interface DashboardData {
  readonly profile: Profile;
  readonly works: readonly Work[];
  readonly favorites: readonly Favorite[];
  readonly values: readonly CoreValue[];
  readonly skills: readonly Skill[];
}

/**
 * ソート設定
 */
export interface SortConfig {
  readonly key: string | null;
  readonly direction: "asc" | "desc";
}

/**
 * セクション表示設定
 */
export interface SectionVisibility {
  readonly works: boolean;
  readonly favorites: boolean;
  readonly values: boolean;
  readonly skills: boolean;
}

/**
 * テーマ変数
 */
export interface ThemeVars {
  readonly bg: string;
  readonly text: string;
  readonly subText: string;
  readonly card: string;
  readonly accent: string;
  readonly btnPrimary: string;
  readonly btnSecondary: string;
  readonly rowHover: string;
  readonly headerBg: string;
  readonly overlay: string;
}
