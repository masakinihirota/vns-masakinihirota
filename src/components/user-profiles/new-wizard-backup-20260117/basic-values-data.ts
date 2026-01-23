export interface BasicValueQuestion {
  id: string;
  title: string;
  category: string;
  tier?: 1 | 2 | 3;
  options: string[];
  description?: string;
  tags?: string[];
  externalLink?: string;
  optional?: boolean;
}

// 厳選された10個の質問
export const BASIC_VALUE_QUESTIONS: BasicValueQuestion[] = [
  // --- 人間性・判断の土台 (Core) ---
  {
    id: "peace_seeking",
    title: "あなたは平和を求めますか？",
    category: "人間性・判断の土台",
    tier: 1,
    options: ["はい", "いいえ"],
    tags: ["attitude"],
  },
  {
    id: "justice_evil",
    title: "この世の正義と悪",
    category: "人間性・判断の土台",
    tier: 1,
    options: [
      "この世には正義と悪の2種類しかいない",
      "この世には頭のいいとバカの2種類しかいない",
      "この世は何でもグラデーションだと思う",
    ],
    tags: ["philosophy"],
  },
  {
    id: "preconception",
    title: "決めつけ、思い込み",
    category: "人間性・判断の土台",
    tier: 2,
    options: [
      "表面だけをちらっと見て決めつけてはいけない",
      "表面だけをちらっと見て思い込んではいけない",
      "記事のタイトルだけ読んで全てがわかる",
      "記事のタイトルだけ読んでもなにもわからない",
    ],
    tags: ["thinking"],
  },
  {
    id: "different_opinion",
    title: "自分と違う意見",
    category: "人間性・判断の土台",
    tier: 1,
    options: [
      "多様性だと思う",
      "間違った意見だと思う",
      "馬鹿だと思う",
      "沢山の意見があっていい",
      "この世は一つにまとまるべきだ",
      "自分の意見はこの世で唯一正しい意見だ",
    ],
    tags: ["communication"],
  },
  {
    id: "judgement_criteria",
    title: "判断基準（信じるもの）",
    category: "人間性・判断の土台",
    tier: 2,
    options: [
      "自分が間違うことはない",
      "その時時で答えが変わる（人間ならば当たり前）",
      "常に自分を信じている / 常に自分を疑っている",
      "常に周りを信じている / 常に周りを疑っている",
      "常にマスメディアを信じている / 常にマスメディアを疑っている",
      "情報源がなくてもなんとなく直感で判断している",
      "一つの情報源で判断している / 複数の情報源で判断している",
    ],
    tags: ["thinking"],
  },

  // --- 社会性・関係性 (Social) ---
  {
    id: "relationship_building",
    title: "理想的な人間関係の構築",
    category: "社会性・関係性",
    tier: 2,
    options: [
      "狭く浅く",
      "狭く深く",
      "広く浅く",
      "広く深く",
      "人との関係は煩わしい",
      "特に気にしている",
      "あまり気にしていない",
    ],
    tags: ["social"],
  },
  {
    id: "friendliness_style",
    title: "親しさの表現（距離感）",
    category: "社会性・関係性",
    tier: 2,
    options: [
      "仲良くしたいので「さん」付け・敬称を使う",
      "仲良くしたいからこそ呼び捨てにする",
      "距離を置きたいので「さん」付け・敬称を使う",
      "距離を置きたいから呼び捨てにする（関心がない）",
    ],
    tags: ["etiquette"],
  },

  // --- テクノロジー・働き方 (Tech & Work) ---
  {
    id: "internet_connection",
    title: "インターネットへの接続",
    category: "テクノロジー・働き方",
    tier: 2,
    options: [
      "義務（つながらない権利などない）",
      "権利（つながる権利がある）",
      "インフラ（つながっていて当たり前）",
      "選択（つながるかどうかは自由）",
      "毒（離れるべきもの）",
    ],
    tags: ["technology"],
  },
  {
    id: "ai_adoption",
    title: "AI（人工知能）の活用",
    category: "テクノロジー・働き方",
    tier: 1,
    options: [
      "積極的賛成（ガンガン使いたい）",
      "賛成（便利なら使う）",
      "中立・様子見",
      "反対（人間の領域を侵す）",
      "積極的反対（規制すべき）",
    ],
    tags: ["technology"],
  },
  {
    id: "work_communication",
    title: "働く時のコミュニケーション",
    category: "テクノロジー・働き方",
    tier: 2,
    options: [
      "対面・同期重視（直接話したい）",
      "テキスト・非同期重視（チャット等でログを残したい）",
      "作業集中重視（あまり話したくない）",
      "雑談重視（雰囲気を大事にしたい）",
    ],
    tags: ["work"],
  },
];
