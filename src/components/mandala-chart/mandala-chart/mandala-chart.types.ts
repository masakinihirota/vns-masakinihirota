/**
 * マンダラチャートの単一チャートデータ定義
 */
export interface MandalaChartData {
  /** ユニークID */
  readonly id: string;
  /** チャートのタイトル */
  readonly title: string;
  /** 9x9のグリッドデータ (9つのブロック × 9つのセル) */
  readonly grids: readonly (readonly string[])[];
  /** 作成日時 (ISO 8601形式) */
  readonly createdAt: string;
  /** 更新日時 (ISO 8601形式) */
  readonly updatedAt: string;
}

/**
 * 表示モード定数
 */
export const VIEW_MODES = {
  FULL: 'full',
  FOCUS: 'focus',
} as const;

/**
 * 表示モード型
 */
export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

/**
 * 編集中のセル情報
 */
export interface EditingCell {
  /** グリッド（ブロック）のインデックス (0-8) */
  readonly gridIdx: number;
  /** セルのインデックス (0-8) */
  readonly cellIdx: number;
}

/**
 * ローカルストレージで使用するキー
 */
export const STORAGE_KEY = 'mandala_charts_v2';
