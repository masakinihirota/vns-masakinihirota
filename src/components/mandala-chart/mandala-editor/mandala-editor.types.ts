/**
 * マンダラチャートの定数と型定義
 */

export const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export type Label = (typeof LABELS)[number];

export const TOTAL_BLOCKS = 9;
export const CELLS_PER_BLOCK = 9;
export const CENTER_BLOCK_INDEX = 4;
export const CENTER_CELL_INDEX = 4;

/**
 * 周辺ブロックのインデックスを 0-8 のグリッド位置にマップする
 * [0, 1, 2, 3, (4:center), 5, 6, 7, 8]
 */
export const GRID_POSITIONS = [0, 1, 2, 3, 5, 6, 7, 8] as const;

export interface MandalaBlock {
  readonly label: Label | "★";
  readonly title: string;
  readonly items: readonly string[];
}

export interface MandalaData {
  readonly center: MandalaBlock;
  readonly blocks: readonly MandalaBlock[];
}

export const EMPTY_BLOCK_ITEMS = Object.freeze(Array(8).fill(""));

export const SKELETON_DATA: MandalaData = {
  center: { label: "★", title: "", items: EMPTY_BLOCK_ITEMS },
  blocks: LABELS.map((label) => ({
    label,
    title: "",
    items: EMPTY_BLOCK_ITEMS,
  })),
};

/**
 * 表示モードの種類
 * markdown: エディタのみ, split: 分割表示, grid: チャートのみ
 */
export type EditorDisplayMode = "markdown" | "split" | "grid";
/**
 * 表示フィットモード
 * width: 横幅いっぱい, height: 縦幅いっぱい
 */
export type EditorFitMode = "width" | "height";
