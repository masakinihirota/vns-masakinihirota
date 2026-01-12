export const SCALE_OPTIONS = [
  { value: "half_day", label: "半日 (2時間〜映画など)" },
  { value: "one_day", label: "1日 (1〜数冊)" },
  { value: "one_week", label: "一週間 (数冊〜十数冊)" },
  { value: "one_month", label: "一ヶ月以内 (十数冊〜)" },
  { value: "long_term", label: "一ヶ月以上 (十数冊〜百冊以上)" },
] as const;

export interface Work {
  id: string;
  title: string;
  author: string;
  publisher: string;
  summary: string;
  coverImageUrl: string | null;
  officialUrl: string;
  category: "manga" | "anime";
  scale?: string;
  isNew?: boolean;
  isAiGenerated?: boolean;
}

export interface UserEntry {
  tier: string;
  ratingType: "simple" | "tier";
  rating: number;
  memo: string;
  status: string;
  workTitle?: string;
  id?: number;
}

// DBに既に登録されている作品のモック
export const MOCK_DB_WORKS: Work[] = [
  {
    id: "work-1",
    title: "四月は君の嘘",
    author: "新川直司",
    publisher: "講談社",
    summary:
      "母の死をきっかけにピアノが弾けなくなった元神童・有馬公生が、ヴァイオリニスト・宮園かをりと出会い、再び音楽と向き合っていく青春ストーリー。",
    coverImageUrl: null,
    officialUrl: "https://kimiuso.jp",
    category: "manga",
    scale: "one_week",
  },
  {
    id: "work-2",
    title: "葬送のフリーレン",
    author: "山田鐘人 / アベツカサ",
    publisher: "小学館",
    summary:
      "魔王を倒した勇者一行の後日譚。エルフの魔法使いフリーレンが、人間を知るための旅に出る。",
    coverImageUrl: null,
    officialUrl: "https://frieren-anime.jp",
    category: "manga",
    scale: "one_month",
  },
];
