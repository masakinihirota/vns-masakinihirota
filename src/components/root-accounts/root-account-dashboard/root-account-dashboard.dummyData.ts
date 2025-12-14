import { RootAccountDashboardData } from "./root-account-dashboard.types";

export const dummyRootAccountDashboardData: RootAccountDashboardData = {
  user: {
    id: "root_001",
    name: "田中太郎",
    avatar: "https://github.com/shadcn.png", // Use a placeholder that works
    profiles: [
      {
        title: "田中太郎（ビジネス）",
        type: "仕事用",
        description: "IT企業・エンジニア - 公開中",
        active: true,
        badgeColor: "blue",
      },
      {
        title: "T.Tanaka（学習者）",
        type: "学習用",
        description: "プログラミング学習・資格取得 - 公開中",
        active: true,
        badgeColor: "purple",
      },
      {
        title: "田中太郎（真剣交際）",
        type: "婚活用",
        description: "結婚を前提とした真剣な出会い - 限定公開",
        active: true,
        badgeColor: "pink",
        limit: true,
      },
      {
        title: "たなか（アニメ好き）",
        type: "遊び用",
        description: "アニメ・ゲーム愛好家 - 限定公開",
        active: false,
        badgeColor: "green",
      },
    ],
  },
  groups: {
    managed: [
      { name: "IT勉強会グループ", members: 45 },
      { name: "ゲーム開発コミュニティ", members: 32 },
    ],
    joined: [
      { name: "音楽制作サークル", members: 18 },
      { name: "読書クラブ", members: 24 },
    ],
  },
  alliances: {
    leader: [
      { name: "テックイノベーション連合", description: "技術革新を推進する企業・個人の連合体" },
    ],
    member: [{ name: "クリエイター協会", description: "デザイナー・アーティストの交流と支援" }],
  },
  accountStatus: {
    status: "アクティブ",
    type: "プレミアム",
    days: 127,
    lastLogin: "2025年1月23日 14:30",
  },
  accountSettings: {
    tutorialDone: true,
    valuesAnswered: true,
    adsConsent: false,
    menuLevel: "基本",
  },
  warnings: {
    count: 0,
    resetCount: 1,
    lastReset: "2024年8月15日",
  },
  oauth: {
    google: { connected: true, email: "tanaka@gmail.com" },
    github: { connected: true, username: "tanaka-dev" },
    twitter: { connected: false },
    stats: { connected: 2, disconnected: 1 },
  },
  basicInfo: {
    language: {
      native: "日本語",
      available: ["日本語（ネイティブ）", "英語（中級）", "中国語（初級）"],
    },
    region: {
      current: "Area 1 (日付変更線〜+8h)",
      areas: [
        { name: "Area 1", description: "日付変更線 〜 +8時間 (120°)", selected: true },
        { name: "Area 2", description: "+8時間 〜 +16時間 (120°)", selected: false },
        { name: "Area 3", description: "+16時間 〜 日付変更線 (120°)", selected: false },
      ],
    },
  },
};
