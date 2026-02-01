/**
 * チュートリアルシナリオの共通型定義
 */

// 話者の種類
export type Speaker = "The Queen" | "Guide" | "AI" | "AO";

// ダイアログ1行分のデータ
export interface DialogueLine {
  readonly speaker: Speaker;
  readonly text: string;
  readonly emotion?: "neutral" | "happy" | "sad" | "angry";
}

// シーンデータ
export interface SceneData {
  readonly id: string;
  readonly name: string;
  readonly lines: readonly string[];
  readonly speaker: Speaker;
}

// レベル設定
export interface LevelConfig {
  readonly id: number;
  readonly name: string;
  readonly titleJa: string;
  readonly phases: readonly string[];
  readonly scenes: Record<string, SceneData>;
}
