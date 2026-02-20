/**
 * @file identity-visualization.logic.ts
 * @description アイデンティティ可視化機能のデータ型、定数、および計算ロジック
 */

export type ProfileId = string;

export interface Profile {
  readonly id: ProfileId;
  readonly name: string;
  readonly label: string;
  readonly color?: string;
  readonly img: string;
}

export interface Account {
  readonly name: string;
  readonly label: string;
  readonly img: string;
}

/**
 * キャラクター設定（仕様書に基づく）
 */
export const IDENTITY_CONFIG = {
  account: {
    name: "M君",
    label: "ユーザー本体",
    img: "/images/characters/identity/m-kun.png",
  },
  ghost: {
    id: "ghost",
    name: "シュレディンガーちゃん",
    label: "基本（幽霊）",
    img: "/images/characters/identity/schrodinger.png",
  },
  masks: [
    {
      id: "mask-ai-chan",
      name: "AIちゃん",
      label: "仮面A",
      color: "#ec4899", // pink-500
      img: "/images/characters/identity/ai-chan.png",
    },
    {
      id: "mask-ai-kun",
      name: "AI君",
      label: "仮面B",
      color: "#3b82f6", // blue-500
      img: "/images/characters/identity/ai-kun.png",
    },
    {
      id: "mask-ao-chan",
      name: "AOちゃん",
      label: "仮面C",
      color: "#8b5cf6", // violet-500
      img: "/images/characters/identity/ao-chan.png",
    },
    {
      id: "mask-ao-kun",
      name: "AO君",
      label: "仮面D",
      color: "#10b981", // emerald-500
      img: "/images/characters/identity/ao-kun.png",
    },
  ],
} as const;

/**
 * 指定されたプロフィールIDに対応する表示データを取得する
 *
 * @param id - プロフィールID（'ghost' または UUID）
 * @returns 該当する Profile オブジェクト。見つからない場合は ghost データを返す。
 */
export const getProfileById = (id: ProfileId): Profile => {
  if (id === "ghost") return IDENTITY_CONFIG.ghost;
  const mask = IDENTITY_CONFIG.masks.find((m) => m.id === id);
  return mask ?? IDENTITY_CONFIG.ghost;
};

/**
 * 2点を結ぶ3次ベジェ曲線のCSSパス文字列を生成する
 * 始点から終点へ、水平方向の中間に制御点を置くS字カーブを描画するパスコマンドを生成します。
 *
 * @param x1 - 始点 X 座標
 * @param y1 - 始点 Y 座標
 * @param x2 - 終点 X 座標
 * @param y2 - 終点 Y 座標
 * @returns SVG の d 属性に使用できるパス文字列
 */
export const calculateBezierPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string => {
  const cp1x = x1 + (x2 - x1) * 0.5;
  const cp2x = x1 + (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${cp1x} ${y1} ${cp2x} ${y2} ${x2} ${y2}`;
};
