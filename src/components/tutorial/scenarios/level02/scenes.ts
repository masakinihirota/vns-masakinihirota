/**
 * チュートリアル Level02「受肉と千の仮面」シナリオデータ
 *
 * 設計参照: Level02_受肉と千の仮面.md
 *
 * フェーズ:
 * - mask_intro: 仮面（プロフィール）作成の導入
 * - profile_creation: プロフィール作成（外部遷移）
 * - mask_complete: 受肉完了
 * - end: Level02終了
 */

import type { Speaker } from "../types";

// Level02で使用するフェーズ
export const LEVEL02_PHASES = [
  "mask_intro",
  "profile_creation",
  "mask_complete",
  "end",
] as const;

export type Level02Phase = (typeof LEVEL02_PHASES)[number];

// 仮面紹介シーン（Level02導入）
export const SCENE_MASK_INTRO_LINES = [
  "おかえりなさい。無事に契約（登録）は済んだようだね。",
  "それじゃあ、最後に『仮面』を作ろう。",
  "この舞踏会では、誰もが仮面を被って参加するんだ。",
  "恐れることはないよ。仮面は一つじゃなくていい。",
  "仕事の顔、遊びの顔……君の望む数だけ用意しよう。",
  "『人を傷つけるような場所を作らない』。",
  "この誓いを胸に、君の最初の一歩を刻もうか。",
] as const;

// 仮面完成シーン
export const SCENE_MASK_COMPLETE_LINES = [
  "良き『顔』を選びましたね。",
  "その仮面は、貴方を守る盾であり、貴方を表現する媒体です。",
  "これで貴方は『名もなきデータ』から、確かな『個（プロフィール）』になった。",
  "次は……お楽しみの『受肉』だね！ 早く体（アバター）を作ろう！",
] as const;

// Level02の全シーンデータ
export const LEVEL02_SCENES = {
  mask_intro: SCENE_MASK_INTRO_LINES,
  mask_complete: SCENE_MASK_COMPLETE_LINES,
} as const;

// シーンの話者情報
export const LEVEL02_SPEAKERS: Record<keyof typeof LEVEL02_SCENES, Speaker> = {
  mask_intro: "Guide",
  mask_complete: "The Queen",
} as const;

// Level02設定
export const LEVEL02_CONFIG = {
  id: 2,
  name: "incarnation",
  titleJa: "受肉と千の仮面",
} as const;
