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

export const BASIC_VALUE_QUESTIONS: BasicValueQuestion[] = [
  // --- サイト・コミュニティの根幹となる宣言 ---
  {
    id: "oasis",
    title: "オアシス宣言を",
    category: "サイト・コミュニティの根幹となる宣言",
    tier: 1,
    description:
      "コミュニティ運営の基本理念。誹謗中傷のない安心・安全な場所を作るための宣言です。",
    options: ["守る", "守らない", "知らない", "わからない"],
    tags: ["system", "safety"],
    externalLink: "/help/oasis-declaration",
  },
  {
    id: "human_declaration",
    title: "人間宣言を",
    category: "サイト・コミュニティの根幹となる宣言",
    tier: 1,
    description:
      "人は完璧ではなく間違いを犯すが、そこから立ち直り再挑戦できるという考え方です。",
    options: ["守る", "守らない", "知らない", "わからない"],
    tags: ["system", "forgiveness"],
    externalLink: "/help/glossary#human",
  },

  // --- 人間性・平和・暴力に関する基礎 ---
  {
    id: "peace_seeking",
    title: "あなたは平和を求めますか？",
    category: "人間性・平和・暴力に関する基礎",
    tier: 1,
    options: ["はい", "いいえ"],
    tags: ["attitude"],
  },
  {
    id: "violent_behavior",
    title: "あなたの言動は暴力的ですか？（言葉や行動など普段のこと）",
    category: "人間性・平和・暴力に関する基礎",
    tier: 1,
    options: ["はい", "いいえ"],
    tags: ["self-reflection"],
  },
  {
    id: "hate_dislike",
    title: "憎しみ(ヘイト)は嫌だ",
    category: "人間性・平和・暴力に関する基礎",
    tier: 1,
    options: ["はい", "いいえ"],
    tags: ["attitude"],
  },
  {
    id: "comm_ability_face",
    title: "自分の対面でのコミュニケーション能力",
    category: "人間性・平和・暴力に関する基礎",
    tier: 2,
    options: ["高い", "普通", "低い", "わからない"],
    tags: ["ability"],
  },
  {
    id: "comm_ability_remote",
    title: "自分のリモートワークでのコミュニケーション能力",
    category: "人間性・平和・暴力に関する基礎",
    tier: 2,
    options: ["高い", "普通", "低い", "わからない"],
    tags: ["ability"],
  },
  {
    id: "creative_spirit",
    title: "自分の何かを作る気持ち",
    category: "人間性・平和・暴力に関する基礎",
    tier: 2,
    options: ["高い", "普通", "低い", "わからない"],
    tags: ["ability"],
  },

  // --- 認識・判断・情報の扱い方に関する基礎 ---
  {
    id: "justice_evil",
    title: "この世の正義と悪",
    category: "認識・判断・情報の扱い方に関する基礎",
    tier: 2,
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
    category: "認識・判断・情報の扱い方に関する基礎",
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
    category: "認識・判断・情報の扱い方に関する基礎",
    tier: 2,
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
    title: "矛盾した回答（判断基準のあり方）",
    category: "認識・判断・情報の扱い方に関する基礎",
    tier: 2,
    options: [
      "自分が間違うことはない",
      "その時時で答えが変わる（人間ならば当たり前）",
      "常に自分を信じている / 常に自分を疑っている",
      "常に周りを信じている / 常に周りを疑っている",
      "常にマスメディアを信じている / 常にマスメディアを疑っている",
      "口コミで判断している / 判断しない",
      "情報源がなくてもなんとなく直感で判断している",
      "一つの情報源で判断している / 複数の情報源で判断している",
      "見て見ぬふりをする",
    ],
    tags: ["thinking"],
  },
  {
    id: "direct_verification",
    title: "自分の目で見て調べて直接会って話して確かめている",
    category: "認識・判断・情報の扱い方に関する基礎",
    tier: 2,
    options: ["はい", "いいえ"],
    tags: ["behavior"],
  },
  {
    id: "posture_ideas",
    title: "基礎となる価値観のアイデア（姿勢）",
    category: "認識・判断・情報の扱い方に関する基礎",
    tier: 3,
    options: [
      "ネットの批判に傾きやすくなる",
      "検証の大事さ",
      "誹謗中傷はしないという誓い",
      "間違った場合の対応",
      "主観と事実を織り交ぜて話すこと",
    ],
    tags: ["attitude"],
  },

  // --- 社会・関係性・ルールに関する基礎 ---
  {
    id: "relationship_focus",
    title: "人との関係に力を入れてること",
    category: "社会・関係性・ルールに関する基礎",
    tier: 2,
    options: [
      "仕事関係",
      "パートナー",
      "家族",
      "友人",
      "趣味を通じて",
      "価値観を通じて",
    ],
    tags: ["social"],
  },
  {
    id: "relationship_building",
    title: "人との関係の構築",
    category: "社会・関係性・ルールに関する基礎",
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
    id: "learning_rules",
    title: "ルールや規則は少しづつ覚えていく",
    category: "社会・関係性・ルールに関する基礎",
    tier: 2,
    options: ["はい", "いいえ"],
    tags: ["social"],
  },
  {
    id: "world_unity",
    title: "この世界は・・・",
    category: "社会・関係性・ルールに関する基礎",
    tier: 3,
    options: ["ばらばらになったほうがいい", "一つにまとまったほうがいい"],
    tags: ["philosophy"],
  },
  {
    id: "friendliness_style",
    title: "私は相手と仲良くする気が",
    category: "社会・関係性・ルールに関する基礎",
    tier: 2,
    options: [
      "あります、だから「さん」付け、もしくは肩書をつけてで話します",
      "あります、それでも呼び捨てで話します",
      "ありません、だから呼び捨てで話します",
      "ありません、それでも「さん」付け、もしくは肩書をつけてで話します",
    ],
    tags: ["etiquette"],
  },
  {
    id: "rehabilitation_support",
    title: "犯罪者が刑期を終えてでてきて名刺や履歴書を作ることは？",
    category: "社会・関係性・ルールに関する基礎",
    tier: 3,
    options: ["自由", "禁止"],
    tags: ["society"],
  },
  {
    id: "site_fairness",
    title: "この価値観サイトでの価値観の選択肢は？",
    category: "社会・関係性・ルールに関する基礎",
    tier: 3,
    options: [
      "公平です",
      "公平ではない",
      "公正です",
      "公正ではない",
      "偏っている",
      "偏っていない",
    ],
    tags: ["system"],
  },

  // --- テクノロジー・働き方に関する基礎 ---
  {
    id: "internet_connection",
    title: "インターネットへの接続",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: [
      "義務です",
      "権利です",
      "人権です",
      "選択です",
      "人と切っては切り離せないものです",
      "人はなくても生きていけます",
    ],
    tags: ["technology"],
  },
  {
    id: "ai_translation_resistance",
    title: "AI翻訳ツールの使用に抵抗がないこと",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: ["はい", "少しある", "かなりある", "ない"],
    tags: ["technology"],
  },
  {
    id: "cross_cultural_ability",
    title: "異文化適応能力",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: ["ある", "ない", "高い", "普通", "低い"],
    tags: ["ability"],
  },
  {
    id: "language_barrier_invalid",
    title: "現在、言語の壁はほぼ無効化出来ている",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: ["はい", "いいえ"],
    tags: ["technology"],
  },
  {
    id: "ai_adoption",
    title: "AIの活用",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: [
      "積極的賛成",
      "賛成",
      "消極的賛成",
      "消極的反対",
      "反対",
      "積極的反対",
    ],
    tags: ["technology"],
  },
  {
    id: "work_communication",
    title: "働く時のコミュニケーションは？",
    category: "テクノロジー・働き方に関する基礎",
    tier: 2,
    options: [
      "対面が得意 / 普通 / 苦手",
      "メールが得意 / 普通 / 苦手",
      "ツール（Slack等）を使いたい / 使いたくない",
      "議事録は残す / 残さない",
      "同期して働きたい / 非同期で働きたい",
      "作業に集中したい / 雑談しながら働きたい",
    ],
    tags: ["work"],
  },

  // --- 属性に関する基礎 ---
  {
    id: "age_status",
    title: "あなたは成年ですか、未成年ですか？",
    category: "属性に関する基礎",
    tier: 1,
    options: ["成年です", "未成年です", "答えたくない"],
    optional: true,
    tags: ["profile"],
  },

  // --- 既存の重要な思想 (整理) ---
  {
    id: "thousand_masks",
    title: "千の仮面",
    category: "サイト・コミュニティの根幹となる宣言",
    tier: 1,
    description:
      "人には仕事、遊び、家族など「複数の顔（ペルソナ）」があり、それぞれを使い分けることを肯定しますか？",
    options: [
      "肯定する",
      "否定する（裏表がないべき）",
      "わからない",
      "答えない",
    ],
    tags: ["system", "identity"],
    externalLink: "/help/glossary#thousand-masks",
  },
  {
    id: "schrodinger_cat",
    title: "シュレディンガーの猫主義",
    category: "サイト・コミュニティの根幹となる宣言",
    tier: 1,
    description:
      "相反する価値観が同時に存在することを認め、自分に合う世界だけを観測し、合わない世界には干渉しない生き方を選びますか？",
    options: [
      "選ぶ（観測するまで確定しない）",
      "選ばない（白黒はっきりさせる）",
      "わからない",
      "答えない",
    ],
    tags: ["system", "philosophy"],
    externalLink: "/help/glossary#schrodinger-cat",
  },
];
