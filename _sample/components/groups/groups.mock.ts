import { Member, RatingTier, ValueTopic } from "./groups.types";

export const MOCK_WORKS: any[] = Array.from({ length: 40 }, (_, index) => ({
  id: (index + 1).toString(),
  title:
    [
      "進撃の巨人",
      "葬送のフリーレン",
      "チェンソーマン",
      "ONE PIECE",
      "呪術廻戦",
      "推しの子",
      "SPY×FAMILY",
      "ブルーロック",
      "ぼっち・ざ・ろっく！",
      "怪獣8号",
      "ヴィンランド・サガ",
      "キングダム",
      "ゴールデンカムイ",
      "僕のヒーローアカデミア",
      "ハイキュー!!",
      "スラムダンク",
      "幽☆遊☆白書",
      "ハンターハンター",
      "NARUTO",
      "BLEACH",
      "ジョジョの奇妙な冒険",
      "鋼の錬金術師",
      "DEATH NOTE",
      "銀魂",
      "攻殻機動隊",
      "エヴァンゲリオン",
      "まどか☆マギカ",
      "コードギアス",
      "シュタインズゲート",
      "カウボーイビバップ",
    ][index % 30] + (index >= 30 ? ` 第${Math.floor(index / 30) + 1}期` : ""),
  tiers: {
    t1: Math.floor(Math.random() * 50),
    t2: Math.floor(Math.random() * 30),
    t3: Math.floor(Math.random() * 20),
    nfm: Math.floor(Math.random() * 10),
    unrated: Math.floor(Math.random() * 15),
  },
}));

export const mockWorks = MOCK_WORKS; // Add this alias to satisfy imports if needed

export const MOCK_VALUES_TOPICS: ValueTopic[] = [
  {
    id: "v1",
    title: "生成AIを使う",
    description:
      "クリエイティブな作業や業務において生成AIを積極的に活用しますか？",
    options: ["はい", "いいえ"],
    category: "テクノロジー",
  },
  {
    id: "v2",
    title: "リモートワーク",
    description:
      "チームでの作業において、対面よりもリモート環境を優先しますか？",
    options: ["はい", "いいえ"],
    category: "働き方",
  },
  {
    id: "v3",
    title: "品質とスピード",
    description:
      "プロジェクトにおいて、スピードよりも品質の完成度を重視しますか？",
    options: ["はい", "いいえ"],
    category: "プロジェクト管理",
  },
  {
    id: "v4",
    title: "新しい技術の導入",
    description:
      "安定性よりも、常に最新の技術スタックに挑戦することを好みますか？",
    options: ["はい", "いいえ"],
    category: "テクノロジー",
  },
];

const ratingTiers: RatingTier[] = ["T1", "T2", "T3", "NFM", "unrated"];

export const MOCK_MEMBERS: Member[] = Array.from({ length: 50 }, (_, index) => ({
  id: `u${index}`,
  name: index === 0 ? "自分 (You)" : `メンバー ${index + 1}`,
  role: index === 0 ? "リーダー" : (index % 10 === 0 ? "メディエーター" : "一般"),
  avatar:
    index === 0
      ? "😎"
      : ["🐱", "🎨", "🐕", "🦊", "🐼", "🤖", "👻", "🐗", "🐸"][index % 9],
  traits: index % 2 === 0 ? ["誠実", "合理性"] : ["調和", "情熱"],
  ratings: Object.fromEntries(
    MOCK_WORKS.map((w) => [w.id, ratingTiers[Math.floor(Math.random() * 5)]])
  ),
  values: {
    v1: { choice: index % 2 === 0 ? "はい" : "いいえ", tier: "T1" },
    v2: { choice: index % 3 === 0 ? "はい" : "いいえ", tier: "T2" },
    v3: { choice: "はい", tier: "T1" },
    v4: { choice: index % 4 === 0 ? "いいえ" : "はい", tier: "T3" },
  },
}));

export const RATING_ORDER: Record<RatingTier, number> = {
  T1: 5,
  T2: 4,
  T3: 3,
  NFM: 2,
  unrated: 1,
};
