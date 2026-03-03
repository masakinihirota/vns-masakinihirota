/**
 * お祝いくす玉のロジックと型定義
 */

export const CONFETTI_COLORS = [
  '#FFD700', // ゴールド
  '#C0C0C0', // シルバー
  '#FF6347', // トマト
  '#00CED1', // ダークターコイズ
  '#FF69B4', // ホットピンク
  '#32CD32', // ライムグリーン
  '#BA55D3', // ミディアムオーキッド
  '#FFFFFF', // ホワイト
  '#FF4500', // オレンジレッド
  '#1E90FF', // ドジャーブルー
  '#FF8C00', // ダークオレンジ
  '#ADFF2F'  // グリーンイエロー
] as const;

export type ConfettiData = {
  readonly id: number;
  readonly color: string;
  readonly delay: number;
};

export type ConfettiStyle = {
  readonly left: string;
  readonly backgroundColor: string;
  readonly '--sway-amount': string;
  readonly '--sway-duration': string;
  readonly '--rotate-x': string;
  readonly '--rotate-y': string;
  readonly '--rotate-z': string;
  readonly '--piece-scale': number;
  readonly animationDelay: string;
  readonly animationDuration: string;
};

/**
 * ランダムな紙吹雪データを生成する
 */
export const generateConfettiData = (count: number): readonly ConfettiData[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 5,
  }));
};
