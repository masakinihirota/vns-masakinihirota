export interface BasicValueQuestion {
  id: string;
  title: string;
  tier?: 1 | 2 | 3;
  options: string[];
  description?: string;
  tags?: string[];
}

export const BASIC_VALUE_QUESTIONS: BasicValueQuestion[] = [
  // 1. オアシス宣言
  // 参照: 0002-オアシス宣言.md
  {
    id: "oasis",
    title: "オアシス宣言",
    tier: 1,
    description:
      "「褒めるときは大きな声でみんなの前で、叱るときは二人きりで小さな声で」というモットーや、安心安全な場所を作るための宣言に同意しますか？",
    options: ["同意して守る", "同意しない", "わからない", "答えない"],
    tags: ["system", "safety"],
  },

  // 2. 人間宣言 (定義の修正)
  // 参照: 0003-人間宣言.md
  // 元の記述は「千の仮面」の内容だったため、正しい「人間宣言」の内容（失敗の許容）に修正
  {
    id: "human",
    title: "人間宣言",
    tier: 1,
    description:
      "「人は完璧ではなく間違いを犯す生き物であり、そこから立ち直り再挑戦（リスタート）することができる」という考え方を認めますか？",
    options: ["認める（寛容）", "認めない（厳格）", "わからない", "答えない"],
    tags: ["system", "forgiveness"],
  },

  // 3. 千の仮面 (新規追加: 元のhumanの記述を分離)
  // 参照: 0001-システム全体構想.md, 0100-用語集.md
  {
    id: "thousand_masks",
    title: "千の仮面",
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
  },

  // 4. シュレディンガーの猫主義 (新規追加: VNSの核となる思想)
  // 参照: 0001-システム全体構想.md, 0100-用語集.md
  {
    id: "schrodinger_cat",
    title: "シュレディンガーの猫主義",
    tier: 1,
    description:
      "相反する価値観が同時に存在することを認め、自分に合う世界だけを観測（選択）し、合わない世界には干渉しない生き方を選びますか？",
    options: [
      "選ぶ（観測するまで確定しない）",
      "選ばない（白黒はっきりさせる）",
      "わからない",
      "答えない",
    ],
    tags: ["system", "philosophy"],
  },

  // 5. 平和への希求
  {
    id: "peace",
    title: "平和への希求",
    tier: 1,
    description:
      "あなたは争いのない平和な世界を望みますか？（「No BAN, Just Drift」の理念に関連）",
    options: ["はい", "いいえ", "答えない"],
    tags: ["attitude"],
  },

  // 6. 自身の暴力性
  {
    id: "violence",
    title: "自身の暴力性",
    tier: 1,
    description:
      "あなたの言動（言葉や行動）は、時には他者を傷つける暴力性を孕んでいると思いますか？",
    options: ["はい", "いいえ", "答えない"],
    tags: ["self-reflection"],
  },

  // 7. 正義と悪 (Tier 2)
  {
    id: "justice",
    title: "正義と悪",
    tier: 2,
    description:
      "この世には「正義と悪」の2種類しかいないと思いますか？ それとも立場によって変わるグラデーションだと思いますか？",
    options: [
      "2種類のみ（勧善懲悪）",
      "グラデーション",
      "答えは出ない",
      "わからない",
      "答えない",
    ],
    tags: ["philosophy"],
  },

  // 8. 自分と違う意見 (Tier 2)
  {
    id: "diversity",
    title: "自分と違う意見",
    tier: 2,
    description:
      "違う意見を持つ人を見た時、それを「多様性」と捉えますか？ それとも排除すべき「間違い」だと思いますか？",
    options: [
      "多様性として認める",
      "間違いとして正す",
      "関わらない",
      "わからない",
      "答えない",
    ],
    tags: ["communication"],
  },

  // 9. 権利の優先度 (Global展開戦略に基づく修正)
  // 参照: 0014-グローバル展開戦略.md
  {
    id: "rights",
    title: "自由の定義",
    tier: 1,
    description:
      "「何でも言える自由（表現の自由・戦う自由）」と「嫌なものを見なくて済む自由（平穏に過ごす権利）」のどちらを優先しますか？",
    options: [
      "表現の自由（戦う自由）",
      "平穏に過ごす権利（住み分け）",
      "バランス重視",
      "答えない",
    ],
    tags: ["rights", "global"],
  },
];
