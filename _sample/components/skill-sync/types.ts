import { LucideIcon } from "lucide-react";

/**
 * ドメインカテゴリの定義
 */
export type CategoryId = "FRONTEND" | "BACKEND_AI" | "INFRA";

export interface Category {
  readonly id: CategoryId;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly color: string;
}

/**
 * スキルテンプレート（マンダラチャートの1つの中心スキル）の定義
 */
export interface SkillTemplate {
  readonly id: string;
  readonly category: CategoryId;
  readonly items: readonly string[];
}

/**
 * プロファイルの定義
 */
export interface Profile {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatarUrl?: string;
  /** key: スキルテンプレートID, value: 習得済みアイテムのインデックス(0-7)の配列 */
  readonly mastery: Readonly<Record<string, readonly number[]>>;
}

/**
 * 表示モード
 */
export type ViewMode = "me" | "all" | "target";

/**
 * ソート順
 */
export type SortOrder = "asc" | "desc";

/**
 * セルのステータス（比較モード用）
 */
export type CellStatus = "SYNC" | "ADVICE" | "LEARN" | "NONE";
