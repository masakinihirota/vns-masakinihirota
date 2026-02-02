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
    desc: "プロフィールに、自らの作品や「今・未来・人生」で好きな作品リスト、価値観、スキルを登録します。この情報を利用してマッチングを行います。",
    iconType: "sparkles",
    color: "text-amber-500",
    hasProfileTree: false,
  },
  {
    title: "4. 目的別マッチング",
    desc: "作成したプロフィールの情報を基に、目的ごとに似た価値観を持つ人を探します。複数の目的を1つのプロフィールで利用することも可能です。例えば、「仕事」と「パートナー探し」の両方の目的を1つのプロフィールからマッチングすることも可能です。",
    iconType: "target",
    color: "text-red-500",
    hasProfileTree: false,
  },
  {
    title: "5. 組織の作成",
    desc: "組織とはボトムアップ型の人の集まりです。組織のメンバーは、マッチングして似たような価値観を持つ相手を見つけて、共通の目的を持つ組織へメンバーとして誘ったり、その組織に入ったりします。組織では、メンバー共通のTier表が表示されます。作品の評価の比較だったり、価値観の比較をしたりして、相手のことを理解して会話のきっかけなどにします。",
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
  {
    title: "7. 国を興す",
    desc: "国とはトップダウン型の人の集まりです。国は組織とは違い、プロフィールのマッチングでメンバーを集めません。国は少数の条件を掲げ同じ目的を持った人達を集めます。そうやって国に人を集めていきます。国を興すと、国独自のルールを策定したりできます。",
    iconType: "globe",
    color: "text-emerald-500",
    hasProfileTree: false,
  },
  {
    title: "8. マーケット＆イベント",
    desc: "国でものをつくる人や、イベントを開催します。人と一緒に何かをします。",
    iconType: "store",
    color: "text-rose-500",
    hasProfileTree: false,
  },
] as const;
