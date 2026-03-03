/**
 * ユーザーライフサイクルのフェーズ定義
 */
export const CONCEPT_PHASES = [
  {
    id: "drifting",
    number: 1,
    title: "幽霊 (Drifting)",
    metaphor: "初期状態",
    description: "何者でもなく、他者から認識されない「漂流」の状態。まだ形を持たない純粋な存在です。",
    icon: "Ghost",
  },
  {
    id: "incarnation",
    number: 2,
    title: "受肉 (Incarnation)",
    metaphor: "仮面 (Mask)",
    description: "目的別（遊び、創作、仕事など）に自分の「仮面（プロフィール）」を作成し、この世界での実体を得ます。",
    icon: "UserCircle",
  },
  {
    id: "matching",
    number: 3,
    title: "マッチング (Matching)",
    metaphor: "シンクロ",
    description: "プロフィールを「名刺」として利用し、価値観の近い人をウォッチ・フォロー。共鳴する相手を見つけます。",
    icon: "Users",
  },
  {
    id: "formation",
    number: 4,
    title: "結成 (Formation)",
    metaphor: "グループ",
    description: "志を同じくするメンバーとグループを組みます。ソロ活動も、このフェーズの一つの形です。",
    icon: "UserPlus",
  },
  {
    id: "action",
    number: 5,
    title: "活動 (Action)",
    metaphor: "実動",
    description: "創作、遊び、仕事、パートナー探し。具体的な目的に向けて、仲間と共に、あるいは一人で歩み始めます。",
    icon: "PlayCircle",
  },
] as const;

export type ConceptPhase = (typeof CONCEPT_PHASES)[number];

/**
 * 作品チェーン (Linkage) の定義
 */
export const LINKAGE_CONCEPT = {
  title: "作品チェーン (Linkage)",
  description: "好きな作品を単なるリストで終わらせません。それに関連する「他者が作った作品」を紐付けることで、応援や布教といった「繋がりの連鎖」を生み出します。",
  metaphor: "繋がりの連鎖",
} as const;
