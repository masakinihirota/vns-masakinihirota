/**
 * スタートページのビジネスロジック
 */

import type { FeedItem } from "./start-page.types";

/**
 * タイムラインのフィードアイテム（デモ用静的データ）
 */
export const FEED_ITEMS = [
  {
    id: 1,
    source: "オアシス国",
    content: "新しい「SFアニメ」カテゴリの特区が建国されました。",
    time: "10分前",
    iconType: "globe",
  },
  {
    id: 2,
    source: "クリエイターギルド",
    content: "メンバーの「ツメニト」さんが新しい作品をTier 1に登録しました。",
    time: "1時間前",
    iconType: "users",
  },
  {
    id: 3,
    source: "佐藤さん",
    content:
      "「昨日僕が感動した作品を、今日の君はまだ知らない。」——素晴らしい短編小説を共有しました。",
    time: "3時間前",
    iconType: "user",
  },
] as const satisfies readonly FeedItem[];

/**
 * 基本の使い方ステップ
 */
export const BEGINNER_STEPS = [
  {
    title: "1. アカウントの作成",
    desc: "リアルな情報を入力(本人確認等)して作成します。主な目的は複数のプロフィールの管理です。",
    iconType: "shield-check",
    color: "text-slate-800 dark:text-slate-200",
    hasProfileTree: false,
    hasRootAccountCard: true,
  },
  {
    title: "2. プロフィールの作成",
    desc: "一言で言うと「目的別の名刺」です。このプロフィールにはあなたの価値観を入力します。目的（仕事、遊び、パートナー探しなど）毎に作成して、他のユーザーとのマッチングに使用します。",
    iconType: "user",
    color: "text-blue-500",
    hasProfileTree: true,
  },
  {
    title: "3. 作品・価値観・スキルの登録",
    desc: "今、追っかけている作品(「今」)、これから発売される作品(「未来」)、今まで生きてきた中で最高の作品(「人生」)を登録します。自分が持っている価値観、スキルを登録します。",
    iconType: "sparkles",
    color: "text-amber-500",
    hasProfileTree: false,
  },
  {
    title: "4. 目的別マッチング",
    desc: "作成したプロフィールの情報を基に、目的ごとに似た価値観を持つ人を探します。複数の目的を1つのプロフィールで兼ねることができます。例えば、「仕事」と「パートナー探し」の両方の目的を1つのプロフィールでマッチングできます。",
    iconType: "target",
    color: "text-red-500",
    hasProfileTree: false,
  },
  {
    title: "5. グループの作成",
    desc: "グループはボトムアップ型の人の集まりです。マッチングで集めた人達で作ります。似たような価値観の人達と一緒に何かしたり、会話相手を探します。必ずリーダーになります。",
    iconType: "layers",
    color: "text-blue-400",
    hasProfileTree: false,
  },
  {
    title: "6. 国を興す",
    desc: "国とはトップダウン型の人の集まりです。少数の条件で人を集めます。例えば「ものづくりの国」を興し、ものづくりに興味がある人達を集めます。",
    iconType: "globe",
    color: "text-emerald-500",
    hasProfileTree: false,
  },
  {
    title: "7. コミュニティと自治",
    desc: "グループや国で問題が起こったときは（グループや国の）リーダーや調停者(メディエーター)が自治を行います。調停者は持ち回りで全員が行います。",
    iconType: "users",
    color: "text-indigo-500",
    hasProfileTree: false,
  },
  {
    title: "8. マーケット＆イベント",
    desc: "モノ作りやイベントを開催します。国やグループで集めた人達と一緒に何かをします。",
    iconType: "store",
    color: "text-rose-500",
    hasProfileTree: false,
  },
] as const;
