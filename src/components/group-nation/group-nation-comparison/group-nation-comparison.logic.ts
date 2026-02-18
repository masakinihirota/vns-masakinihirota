/**
 * グループと国の比較項目の型定義
 */
export type ComparisonCategory = "origin" | "elements" | "nature_role";

export interface ComparisonItem {
  readonly label: string;
  readonly content: string;
}

export interface ComparisonEntity {
  readonly id: "group" | "nation";
  readonly title: string;
  readonly items: Record<ComparisonCategory, ComparisonItem>;
}

/**
 * 仕様書に基づいた「グループ」と「国」の定義データ
 */
export const COMPARISON_DATA: readonly ComparisonEntity[] = [
  {
    id: "group",
    title: "グループ (Group)",
    items: {
      origin: { label: "成り立ち", content: "自分の価値観や好きで「マッチング」" },
      elements: { label: "構成要素", content: "価値観が似た個人" },
      nature_role: { label: "性質・役割", content: "集合の最小単位：居場所・似た価値観の集まり" },
    },
  },
  {
    id: "nation",
    title: "国 (Nation)",
    items: {
      origin: { label: "成り立ち", content: "グループが掲げた「目的」で集まる。" },
      elements: { label: "構成要素", content: "複数のグループの集合、少数の条件" },
      nature_role: { label: "性質・役割", content: "外向き：社会・活動のインフラ、多様な価値観" },
    },
  },
] as const;
