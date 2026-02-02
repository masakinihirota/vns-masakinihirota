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
    title: "1. ルートアカウントの役割",
    desc: "ルートアカウントはあなたの本拠地です。プロフィールの全体管理、現実の情報（母語・居住地）、ポイント、そして非常時に必要な重要情報を司ります。",
    iconType: "shield-check",
    color: "text-slate-800 dark:text-slate-200",
    hasProfileTree: false,
  },
  {
    title: "2. プロフィールの作成（千の仮面）",
    desc: "プロフィールはあなたの価値観です。サイト内での目的（仕事、遊び、パートナー探しなど）毎に最大1000個まで作成でき、目的毎にマッチングが可能です。",
    iconType: "user",
    color: "text-blue-500",
    hasProfileTree: true,
  },
  {
    title: "3. 作品・価値観・スキルの登録",
    desc: "プロフィールに、自らの作品や「今・未来・人生」で好きな作品リスト、価値観、スキルを登録します。これらがあなたの「盾」となり、自分らしさを表現する要素になります。",
    iconType: "sparkles",
    color: "text-amber-500",
    hasProfileTree: false,
  },
  {
    title: "4. 目的別マッチング",
    desc: "登録した情報を基に、目的ごとに似た価値観を持つ人を探します。共鳴する仲間を真っ先に拾い上げ、一緒に何かを始めるための出会いを提供します。",
    iconType: "target",
    color: "text-red-500",
    hasProfileTree: false,
  },
  {
    title: "5. 組織のTier表と評価の深化",
    desc: "マッチング後に所属する組織では、メンバー共通のTier表が表示されます。作品の評価を変更したり、価値観の追加質問に答えたりして、仲間との相互理解を深めます。",
    iconType: "layers",
    color: "text-blue-400",
    hasProfileTree: false,
  },
  {
    title: "6. コミュニティと自治",
    desc: "価値観の合った人をフォローしたり組織のメンバーになったり。ルールの策定などの自治に参画し、平和な世界（オアシス）を共に広げていきます。",
    iconType: "users",
    color: "text-indigo-500",
    hasProfileTree: false,
  },
] as const;
