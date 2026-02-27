import { Package, Slot, UserProfile } from "./user-profile-app.types";

export const ITEMS: Record<string, Slot> = {
  // Manga
  op: {
    id: "w-m1",
    type: "work",
    category: "漫画",
    title: "ONE PIECE",
    author: "尾田 栄一郎",
    tier: 1,
  },
  bg: {
    id: "w-m2",
    type: "work",
    category: "漫画",
    title: "BLUE GIANT",
    author: "石塚 真一",
    tier: 1,
  },
  frieren: {
    id: "w-m3",
    type: "work",
    category: "漫画",
    title: "葬送のフリーレン",
    author: "山田鐘人",
    tier: 2,
  },
  jjk: {
    id: "w-m4",
    type: "work",
    category: "漫画",
    title: "呪術廻戦",
    author: "芥見 下々",
    tier: 2,
  },
  spy: {
    id: "w-m5",
    type: "work",
    category: "漫画",
    title: "SPYxFAMILY",
    author: "遠藤 達哉",
    tier: 3,
  },
  naruto: {
    id: "w-m6",
    type: "work",
    category: "漫画",
    title: "NARUTO",
    author: "岸本 斉史",
    tier: 1,
  },
  slam: {
    id: "w-m7",
    type: "work",
    category: "漫画",
    title: "SLAM DUNK",
    author: "井上 雄彦",
    tier: 1,
  },

  // Anime
  eva: {
    id: "w-a1",
    type: "work",
    category: "アニメ",
    title: "新世紀エヴァンゲリオン",
    author: "庵野 秀明",
    tier: 1,
  },
  bebop: {
    id: "w-a2",
    type: "work",
    category: "アニメ",
    title: "COWBOY BEBOP",
    author: "渡辺 信一郎",
    tier: 1,
  },
  gits: {
    id: "w-a3",
    type: "work",
    category: "アニメ",
    title: "攻殻機動隊 SAC",
    author: "神山 健治",
    tier: 2,
  },

  // Movie
  inter: {
    id: "w-mv1",
    type: "work",
    category: "映画",
    title: "インターステラー",
    author: "C. Nolan",
    tier: 1,
  },
  lala: {
    id: "w-mv2",
    type: "work",
    category: "映画",
    title: "ラ・ラ・ランド",
    author: "D. Chazelle",
    tier: 2,
  },

  // Values
  kaizen: {
    id: "v1",
    type: "value",
    category: "Mindset",
    title: "継続的改善",
    description: "昨日より少し良くする",
  },
  user: {
    id: "v2",
    type: "value",
    category: "Product",
    title: "ユーザーファースト",
    description: "使う人の痛みを解決する",
  },
  open: {
    id: "v3",
    type: "value",
    category: "Team",
    title: "透明性",
    description: "情報はオープンに",
  },

  // Skills
  react: { id: "s1", type: "skill", category: "Frontend", title: "React" },
  ts: { id: "s2", type: "skill", category: "Language", title: "TypeScript" },
  ui: { id: "s3", type: "skill", category: "Design", title: "UI Design" },
  python: { id: "s4", type: "skill", category: "Backend", title: "Python" },
};

export const MOCK_PACKAGES: Package[] = [
  {
    id: "pkg-m1",
    type: "work",
    category: "漫画",
    title: "王道・冒険セット",
    description: "ジャンプ系を中心とした熱い作品群",
    items: [ITEMS.op, ITEMS.naruto, ITEMS.jjk, ITEMS.slam],
  },
  {
    id: "pkg-m2",
    type: "work",
    category: "漫画",
    title: "感動・ドラマセット",
    description: "涙なしでは読めない名作",
    items: [ITEMS.op, ITEMS.bg, ITEMS.frieren, ITEMS.lala],
  },
  {
    id: "pkg-a1",
    type: "work",
    category: "アニメ",
    title: "SF・サイバーパンク",
    description: "近未来の世界観",
    items: [ITEMS.eva, ITEMS.gits, ITEMS.bebop],
  },
  {
    id: "pkg-mv1",
    type: "work",
    category: "映画",
    title: "映像美・名作選",
    description: "圧倒的なビジュアル体験",
    items: [ITEMS.inter, ITEMS.lala],
  },
  {
    id: "pkg-v1",
    type: "value",
    category: "Values",
    title: "スタートアップ思考",
    description: "スピードと成長を重視",
    items: [ITEMS.kaizen, ITEMS.user, ITEMS.open],
  },
  {
    id: "pkg-s1",
    type: "skill",
    category: "Skills",
    title: "モダンフロントエンド",
    description: "Reactエコシステム",
    items: [ITEMS.react, ITEMS.ts, ITEMS.ui],
  },
];

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: "u1",
    name: "佐藤 健太",
    handle: "@kenta_dev",
    bio: "フロントエンドエンジニア。UXデザインに関心があります。",
    avatarUrl: "https://placehold.co/100x100/2563eb/white?text=K",
    coverUrl: "https://placehold.co/800x200/1e293b/white?text=Cover",
    attributes: {
      purpose: "技術課題解決",
      role: "Builder",
      type: "Protagonist",
    },
    equippedSlots: {
      worksFuture: [],
      worksCurrent: [ITEMS.bg],
      worksLife: [ITEMS.op],
      values: [],
      skills: [ITEMS.react],
    },
    equippedPackages: {
      worksFuture: [],
      // MOCK_PACKAGES[3] など、宣言完了前かもしれない自分自身への参照を避ける
      worksCurrent: [],
      worksLife: [],
      values: [],
      skills: [],
    },
  },
];
