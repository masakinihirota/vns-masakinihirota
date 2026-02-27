/**
 * スキル比較マンダラチャートの型定義とロジック
 */

/**
 * カテゴリID（フロントエンド、AI/バックエンド、インフラ）
 */
export type CategoryId = "FRONTEND" | "BACKEND_AI" | "INFRA";

/**
 * カテゴリ定義
 */
export interface Category {
  /** カテゴリの一意識別子 */
  readonly id: CategoryId;
  /** 表示ラベル */
  readonly label: string;
  /** Lucideアイコン名 */
  readonly iconName: string;
}

/**
 * スキルマスタリー項目（3x3 マンダラのテンプレート）
 */
export interface MandalaTemplate {
  /** 属するカテゴリID */
  readonly category: CategoryId;
  /** 習熟度を示す詳細項目（常に8項目を想定） */
  readonly items: readonly string[];
}

/**
 * ユーザーまたは候補者のプロフィール定義
 */
export interface Profile {
  /** ユーザーID */
  readonly id: string | number;
  /** 表示名 */
  readonly name: string;
  /** 役割・職種 */
  readonly role: string;
  /** スキルごとの習得状況（習得済み項目のインデックス 0-7 を保持） */
  readonly mastery: {
    readonly [skillName: string]: readonly number[];
  };
}

/**
 * マンダラセルの状態定数
 */
export const MANDALA_STATUS = {
  /** 双方が未習得 */
  EMPTY: 0,
  /** 自分のみ習得（アドバイス可能） */
  ADVICE: 1,
  /** 相手のみ習得（学習可能） */
  LEARN: 2,
  /** 双方が習得（同期・共創可能） */
  SYNC: 3,
} as const;

/**
 * マンダラセルの状態型
 */
export type MandalaStatus =
  (typeof MANDALA_STATUS)[keyof typeof MANDALA_STATUS];

/**
 * セルがどの状態（アドバイス/学習/同期）にあるかを判定する
 * @param hasMe 自分が習得しているか
 * @param hasThem 相手が習得しているか
 * @returns {MandalaStatus} 計算されたステータスコード
 */
export const calculateMandalaStatus = (
  hasMe: boolean,
  hasThem: boolean
): MandalaStatus => {
  return ((hasMe ? 1 : 0) + (hasThem ? 2 : 0)) as MandalaStatus;
};

/**
 * 特定スキルの習得済み項目数を取得する
 * @param profile プロフィールオブジェクト
 * @param skillName スキル名
 * @returns {number} 習得数 (0-8)
 */
export const getMasteryCount = (
  profile: Profile | undefined,
  skillName: string
): number => {
  return profile?.mastery?.[skillName]?.length ?? 0;
};

/**
 * リストのソート順序
 */
export type SortOrder = "asc" | "desc";
