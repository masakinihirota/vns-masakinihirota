/**
 * チュートリアル Level01「契約と魂の証明」シナリオデータ
 *
 * 設計参照: Level01_契約と魂の証明.md
 *
 * フェーズ:
 * - scene1: 女王との出会い（AI/AO登場前）
 * - scene2: 世界の説明、地図探しへ
 * - quest: 地図を探す（自由行動）
 * - map_found: コンパス取得、使い方説明
 * - explore: 世界探索（自由行動）
 * - return_to_queen: 女王のところに戻る
 * - guide_intro: 導き手登場、アカウント作成へ
 * - account_creation: ルートアカウント作成（外部遷移）
 */

import type { Speaker } from "../types";

// Level01で使用するフェーズ
export const LEVEL01_PHASES = [
  "scene1",
  "scene2",
  "quest",
  "map_found",
  "explore",
  "return_to_queen",
  "guide_intro",
  "account_creation",
] as const;

export type Level01Phase = (typeof LEVEL01_PHASES)[number];

// シーン1: 女王との出会い
export const SCENE_1_LINES = [
  "……お目覚めですか、名もなき魂よ。",
  "ここは『はじまりの国』。情報の洪流から逃れ、翼を休めるためのオアシスです。",
  "私はこの世界の理（ことわり）を見守る者。あなたがそう呼びたいのであれば、『真咲女王』でも構いません",
  "安心なさい。今のそなたは『幽霊（ゴースト）』。誰の目にも映らず、誰からも傷つけられることはありません。",
  "さあ、少し歩いてみましょう。この世界はあなたの心のように広大です。",
] as const;

// シーン2: 世界の説明、地図探しへ
export const SCENE_2_LINES = [
  "見えますか？ 人々がそれぞれの価値観で輝いているのが。",
  "そなたは今、彼らを見て(ウォッチ)しています。彼らはそなたに気づきません。",
  "近づきすぎる必要はありません。合わないと思えば、ただ静かに離れればよいのです（Drift）。",
  "それが、この世界で争わずに生きるための知恵なのですから。",
  "さて、迷わないように『地図』を探してきなさい。この近くに落ちているはずです。",
] as const;

// 地図発見シーン
export const SCENE_MAP_FOUND_LINES = [
  "地図（コンパス）を手に入れましたね。これで行き先を知ることができます。",
  "右上に表示されているコンパスを見てください。現在地と方角がわかりますね。",
  "コンパスボタンを押せば、地図の拡大表示と、行きたい場所へのワープができますよ。",
  "自由に見て回ってください。準備ができたら、私のところに戻ってきてくださいね。",
] as const;

// 女王帰還シーン
export const SCENE_RETURN_TO_QUEEN_LINES = [
  "おかえりなさい。世界は広いでしょう？",
  "……それでは、私は少し席を外しますね。後は『彼』に任せましょう。",
] as const;

// 導き手登場シーン
export const SCENE_GUIDE_INTRO_LINES = [
  "やあ、はじめまして。私は『導き手』。",
  "女王様から、君の案内を任されているんだ。",
  "さて、地図も手に入れたことだし、本格的にこの世界に参加する準備をしようか。",
  "この世界では、君だけの『ルートアカウント』を持つことで、自分の存在を確立できるんだ。",
  "難しく考える必要はないよ。君のこれまでの経験やスキルが、そのまま君の価値になる。",
  "ルートアカウントを作りに行きます、よろしいですね？",
] as const;

// Level01の全シーンデータ
export const LEVEL01_SCENES = {
  scene1: SCENE_1_LINES,
  scene2: SCENE_2_LINES,
  map_found: SCENE_MAP_FOUND_LINES,
  return_to_queen: SCENE_RETURN_TO_QUEEN_LINES,
  guide_intro: SCENE_GUIDE_INTRO_LINES,
} as const;

// シーンの話者情報
export const LEVEL01_SPEAKERS: Record<keyof typeof LEVEL01_SCENES, Speaker> = {
  scene1: "The Queen",
  scene2: "The Queen",
  map_found: "The Queen",
  return_to_queen: "The Queen",
  guide_intro: "Guide",
} as const;

// Level01設定
export const LEVEL01_CONFIG = {
  id: 1,
  name: "awakening",
  titleJa: "契約と魂の証明",
} as const;
