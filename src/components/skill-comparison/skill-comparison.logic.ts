/**
 * スキル比較マンダラチャートの型定義とロジック
 */

/**
 * カテゴリ定義
 */
export type CategoryId = "FRONTEND" | "BACKEND_AI" | "INFRA";

export interface Category {
  readonly id: CategoryId;
  readonly label: string;
  readonly iconName: string; // Lucideアイコン名
}

/**
 * スキルマスタリー項目
 */
export interface MandalaTemplate {
  readonly category: CategoryId;
  readonly items: readonly string[]; // 常に8項目
}

/**
 * プロフィール定義
 */
export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly mastery: {
    readonly [skillName: string]: readonly number[]; // 習得済み項目のインデックス (0-7)
  };
}

/**
 * マンダラセルの状態
 */
export const MANDALA_STATUS = {
  EMPTY: 0,
  ADVICE: 1,
  LEARN: 2,
  SYNC: 3,
} as const;

export type MandalaStatus =
  (typeof MANDALA_STATUS)[keyof typeof MANDALA_STATUS];

/**
 * セルの状態を判定するロジック
 * @param hasMe 自分が習得しているか
 * @param hasThem 相手が習得しているか
 * @returns MandalaStatus
 */
export const calculateMandalaStatus = (
  hasMe: boolean,
  hasThem: boolean
): MandalaStatus => {
  return ((hasMe ? 1 : 0) + (hasThem ? 2 : 0)) as MandalaStatus;
};

/**
 * スキルの習得数を取得する
 */
export const getMasteryCount = (
  profile: Profile | undefined,
  skillName: string
): number => {
  return profile?.mastery?.[skillName]?.length ?? 0;
};

/**
 * ソート順序
 */
export type SortOrder = "asc" | "desc";
