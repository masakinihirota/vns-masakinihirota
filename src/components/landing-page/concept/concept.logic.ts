/**
 * 価値観サイトのコンセプトにおけるフェーズの定義
 */
export type ConceptPhase = {
  readonly id: number;
  readonly title: string;
  readonly description: string;
};

/**
 * 作品チェーン（布教・繋がりの連鎖）の定義
 */
export type WorkChain = {
  readonly workTitle: string;
  readonly workUrl: string;
  readonly chainTitle: string;
  readonly chainUrl: string;
  readonly chainLabel: string;
  readonly tier?: string;
};

/**
 * ユーザーライフサイクルの5フェーズ
 * 仕様書に基づき定義
 */
export const CONCEPT_PHASES: readonly ConceptPhase[] = [
  {
    id: 1,
    title: "幽霊",
    description: "最初は何者でもなく、誰にも見えない「漂流」の状態",
  },
  {
    id: 2,
    title: "受肉",
    description: "目的別(遊び、創る、働く、パートナー探し等)のプロフィール（自分で作った作品・自分の好きな作品・価値観・スキル）を仮面とし、幽霊が仮面をつけて実体を持つ",
  },
  {
    id: 3,
    title: "マッチング",
    description: "プロフィールを名刺として使い、価値観の近い人を探し、ウォッチやフォローをする",
  },
  {
    id: 4,
    title: "結成",
    description: "メンバーを集めてグループを作る（一人での活動も可能）",
  },
  {
    id: 5,
    title: "活動",
    description: "一緒に創る、遊ぶ、働く、パートナーを探す",
  },
] as const;

/**
 * 作品チェーンの例
 * 仕様書に基づき定義
 */
export const WORK_CHAINS: readonly WorkChain[] = [
  {
    workTitle: "進撃の巨人",
    workUrl: "https://shingeki.net/",
    chainTitle: "作品のチェーン 関連する作品 Link",
    chainUrl: "https://www.youtube.com/watch?v=JvkbWrl8GJY",
    chainLabel: "【進撃の巨人】名シーンまとめ⑰【海外の反応】 youtube.com/watch?v=JvkbWrl8GJY",
    tier: "T1",
  },
  {
    workTitle: "チ。 ―地球の運動について―",
    workUrl: "https://anime-chi.jp/",
    chainTitle: "作品のチェーン 関連する作品 Link",
    chainUrl: "https://www.youtube.com/watch?v=pTwSEgflLq0",
    chainLabel: "amazarashi 『カシオピア係留所』Music Video feat. 「チ。」 youtube.com/watch?v=pTwSEgflLq0",
    tier: "T1",
  },
] as const;

/**
 * 補足説明
 */
export const CONCEPT_NOTE = "※自分が好きな作品とその評価(Tier1)、そして「チェーン」はより強いつながりを感じる誰かが作った作品。 こんな作品を誰かが作ったと布教して広めたい作品" as const;

export const CONCEPT_GHOST_TEXT = "このサイトは価値観に基づく友人探索サイトです。幽霊(＝匿名)に複数の仮面（＝目的別プロフィール）をつけて活動します。オアシス宣言で安心・安全なサイトを目指します。" as const;
