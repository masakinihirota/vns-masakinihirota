import {
  Monitor,
  BookOpen,
  Film,
  Gamepad2,
  MoreHorizontal,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { z } from "zod";

// --- Constants ---
export const BASE_POINTS = 100;
export const DISCOUNT_TAGS = 30;
export const DISCOUNT_URL = 50;

export const CATEGORIES = [
  { id: "anime", label: "アニメ", icon: Monitor },
  { id: "comic", label: "漫画", icon: BookOpen },
  { id: "novel", label: "小説", icon: BookOpen },
  { id: "movie", label: "映画", icon: Film },
  { id: "game", label: "ゲーム", icon: Gamepad2 },
  { id: "other", label: "その他", icon: MoreHorizontal },
];

export const PERIOD_GROUPS = [
  {
    id: "future",
    label: "未来",
    items: [
      { id: "future_far", label: "制作決定・発売、公開時期未定" },
      { id: "future_near", label: "1年以内 (発売・公開予定)" },
      { id: "future_1month", label: "1ヶ月以内 (発売・公開予定)" },
    ],
  },
  {
    id: "present",
    label: "今・2020年代",
    items: [
      {
        id: "current_ongoing",
        label: "現在連載・放送中・新発売 (約1週間〜1ヶ月以内)",
      },
      { id: "recent_3months", label: "今期・放送中 (約3ヶ月以内)" },
      { id: "recent_6months", label: "半年以内" },
      { id: "recent_1year", label: "今年 (1年以内)" },
      { id: "2020s", label: "2020年代" },
    ],
  },
  {
    id: "past",
    label: "過去 (2010年代以前)",
    collapsible: true, // 折りたたみ可能フラグ
    items: [
      { id: "2010s", label: "2010年代" },
      { id: "2000s", label: "2000年代" },
      { id: "1990s", label: "1990年代" },
      { id: "1980s", label: "1980年代" },
      { id: "20th_century", label: "20世紀 (1901年～2000年)" },
      { id: "19th_century", label: "19世紀 (1801年～1900年)" },
      { id: "classic", label: "それ以前 (1800年以前・古典)" },
    ],
  },
];

export const OFFICIAL_TAGS = [
  "アニメ化",
  "映画化",
  "ゲーム化",
  "ドラマ化",
  "舞台化",
  "受賞作",
  "殿堂入り",
  "ベストセラー",
  "公式配信あり",
  "完結済み",
  "連載中",
  "読み切り",
  "スピンオフ",
  "リメイク",
  "完全版あり",
  "声優豪華",
  "作画神",
  "ストーリー重視",
  "キャラクター重視",
];

export const USER_TAGS = [
  "神作",
  "泣ける",
  "人生観変わる",
  "トラウマ",
  "癒やし",
  "伏線回収",
  "作画崩壊",
  "OST最高",
  "期待大",
  "予約済み",
  "尊い",
  "推しがいる",
  "寝不足確定",
  "腹筋崩壊",
  "全人類見て",
  "実質無料",
  "考察が捗る",
  "鬱展開",
  "ハッピーエンド",
  "衝撃のラスト",
  "作業用BGM",
  "周回前提",
  "沼",
  "語彙力喪失",
];

export const URL_TYPES = [
  { id: "official", label: "公式サイト・情報", icon: Globe },
  { id: "affiliate", label: "購入・アフィリエイト", icon: ShoppingCart },
];

// --- Schema ---
export const workSchema = z.object({
  title: z
    .string()
    .min(1, "作品タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  category: z.string().min(1, "カテゴリを選択してください"),
  period: z.string().min(1, "制作年代を選択してください"),
  urls: z
    .array(
      z.object({
        type: z.string(),
        value: z.string().optional(), // 空文字も許容して、submit時にfilterする方針か、あるいはurl形式チェックするか
      })
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  // pointsSpent は計算値なのでフォーム入力としては必須ではないが、
  // 送信データに含めるならここで定義してもよい。
  // ただし、バリデーション対象というよりは結果なので、一旦外すか optional にする。
});

export type WorkFormValues = z.infer<typeof workSchema>;

export const initialFormValues: WorkFormValues = {
  title: "",
  category: "anime",
  period: "2020s",
  urls: [
    { type: "official", value: "" },
    { type: "affiliate", value: "" },
  ],
  tags: [],
};

export const dummyFormValues: WorkFormValues = {
  title: "STEINS;GATE",
  category: "game",
  period: "2000s",
  urls: [
    { type: "official", value: "http://steinsgate.jp/" },
    { type: "affiliate", value: "https://www.amazon.co.jp/dp/B00XXX" },
  ],
  tags: [
    "ゲーム化",
    "アニメ化",
    "神作",
    "伏線回収",
    "エル・プサイ・コングルゥ",
  ],
};
