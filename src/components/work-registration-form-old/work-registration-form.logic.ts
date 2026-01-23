export const CATEGORIES = ["アニメ", "漫画", "ゲーム", "映画", "小説"];
export const SUB_CATEGORIES: Record<string, string[]> = {
  アニメ: ["冒険", "格闘", "大河", "ラブコメ", "BL"],
  漫画: [
    "少年漫画",
    "少女漫画",
    "青年漫画",
    "女性漫画",
    "ラブコメ",
    "スポーツ",
  ],
  // 他のカテゴリのサブカテゴリも同様に定義
};
export const TIER_NAMES: Record<number, string> = {
  1: "ティア1",
  2: "ティア2",
  3: "ティア3",
  4: "普通もしくは自分に合わない",
  5: "未評価",
  6: "未読",
  7: "おすすめ",
};
