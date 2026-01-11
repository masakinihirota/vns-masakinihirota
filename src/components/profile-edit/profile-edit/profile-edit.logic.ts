export type UserProfile = {
  name: string;
  stats: {
    works: number;
    evals: number;
    trustDays: number;
    points: number;
  };
  // New fields for creation flow
  format?: string;
  role?: string;
  purposes?: string[];
  type?: string;
  avatarUrl?: string;
};

export type UserWork = {
  id: number;
  title: string;
  category: string;
  date: string;
  role: string;
  tools: string;
  description: string;
};

export type UserEvaluation = {
  id: number;
  title: string;
  category: "アニメ" | "漫画" | "その他"; // Simplified
  status: "now" | "future" | "life";
  tier: "tier1" | "tier2" | "tier3";
};

export type UserValue = {
  id: number;
  category: string;
  topic: string;
  answers: string[];
  level: "重要" | "通常";
};

// Initial Data Factory
export const createInitialProfile = (): UserProfile => ({
  name: "New User",
  stats: { works: 0, evals: 0, trustDays: 0, points: 0 },
  format: "profile",
  role: "member",
  purposes: ["work"],
  type: "self",
});

export const MOCK_WORKS: UserWork[] = [
  {
    id: 1,
    title: "オアシス宣言：第1章",
    category: "漫画",
    date: "2025-10",
    role: "原作・作画",
    tools: "Clip Studio Paint",
    description:
      "インターネットの喧騒から離れた『心の安息地』をテーマにしたSF短編漫画。第1章ではVNSの誕生秘話を描いています。",
  },
  {
    id: 2,
    title: "VNSの夜明け",
    category: "アニメ",
    date: "2025-12",
    role: "監督・脚本",
    tools: "Blender, After Effects",
    description:
      "価値観が視覚化された近未来を舞台にしたフル3DCGアニメーション。シュレディンガーの猫をモチーフにした演出が特徴。",
  },
  {
    id: 3,
    title: "境界のアルゴリズム",
    category: "漫画",
    date: "2026-01",
    role: "シナリオ協力",
    tools: "Notion, Google Docs",
    description:
      "AIと人間が共生する社会における『個の価値』を問う哲学的ミステリー。複雑な設定をあえて簡潔な線で表現しています。",
  },
];

export const MOCK_EVALUATIONS: UserEvaluation[] = [
  {
    id: 1,
    title: "カウボーイビバップ",
    category: "アニメ",
    status: "life",
    tier: "tier1",
  },
  {
    id: 2,
    title: "寄生獣",
    category: "漫画",
    status: "life",
    tier: "tier1",
  },
  {
    id: 3,
    title: "最新のSFアニメX",
    category: "アニメ",
    status: "now",
    tier: "tier2",
  },
  {
    id: 4,
    title: "日常の断片",
    category: "漫画",
    status: "now",
    tier: "tier3",
  },
  {
    id: 5,
    title: "2026年期待作α",
    category: "アニメ",
    status: "future",
    tier: "tier1",
  },
  {
    id: 6,
    title: "プラネテス",
    category: "アニメ",
    status: "life",
    tier: "tier1",
  },
];

export const MOCK_VALUES: UserValue[] = [
  {
    id: 1,
    category: "基礎の基礎",
    topic: "インターネットへの接続",
    answers: ["義務です", "権利です", "人権です"],
    level: "重要",
  },
  {
    id: 2,
    category: "仕事",
    topic: "コミュニケーション様式",
    answers: ["非同期中心", "テキストベース"],
    level: "通常",
  },
];
