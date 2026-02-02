/**
 * スタートページの型定義
 */

/** ビューモードの種類 */
export type ViewMode = "latest" | "beginner";

/** フィードアイテムの型 */
export interface FeedItem {
  readonly id: number;
  readonly source: string;
  readonly content: string;
  readonly time: string;
  readonly iconType: "globe" | "users" | "user";
}

/** スタートページのProps */
export interface StartPageProps {
  /** 初期表示モード */
  readonly initialViewMode?: ViewMode;
}

/** ビュートグルのProps */
export interface ViewToggleProps {
  /** 現在のビューモード */
  readonly viewMode: ViewMode;
  /** ビューモード変更ハンドラ */
  readonly onViewModeChange: (mode: ViewMode) => void;
}
