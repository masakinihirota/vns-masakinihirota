/**
 * 星座に基づく匿名名生成ユーティリティ
 */

// マテリアル定数
export const MATERIALS = [
  "マテリアル",
  "光",
  "幻想",
  "氷",
  "炎",
  "輝き",
  "熱狂",
  "闇",
  "風",
  "水",
  "土",
  "雷",
  "音",
  "光速",
  "宇宙",
];

// 色定数
export const COLORS = [
  "赤い",
  "青い",
  "黄色い",
  "緑の",
  "紫の",
  "橙色の",
  "ピンクの",
  "茶色の",
  "灰色の",
  "黒い",
  "白い",
];

// 星座定数
export const CONSTELLATIONS = [
  "牡羊座",
  "牡牛座",
  "双子座",
  "蟹座",
  "獅子座",
  "乙女座",
  "天秤座",
  "蠍座",
  "射手座",
  "山羊座",
  "水瓶座",
  "魚座",
];

// 星座に対応する記号マップ
export const ZODIAC_SYMBOLS: Record<string, string> = {
  牡羊座: "♈",
  牡牛座: "♉",
  双子座: "♊",
  蟹座: "♋",
  獅子座: "♌",
  乙女座: "♍",
  天秤座: "♎",
  蠍座: "♏",
  射手座: "♐",
  山羊座: "♑",
  水瓶座: "♒",
  魚座: "♓",
};

/**
 * 星座に基づいてランダムな匿名名を生成する
 * 形式: [色][マテリアル]の[星座]
 * 例: "赤い熱狂の獅子座"
 * @param zodiac 星座名 (例: "獅子座")
 * @returns 生成された匿名名
 */
export function generateAnonymousName(zodiac: string): string {
  // 星座が有効なリストにあるかチェック、なければそのまま返す（またはランダム選択）
  if (!CONSTELLATIONS.includes(zodiac)) {
    return zodiac; // フォールバック
  }

  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const randomMaterial =
    MATERIALS[Math.floor(Math.random() * MATERIALS.length)];

  return `${randomColor}${randomMaterial}の${zodiac}`;
}

/**
 * 星座名から対応する記号を取得する
 * @param zodiac 星座名
 * @returns 星座記号 (未定義の場合は空文字またはデフォルトアイコン用判定値)
 */
export function getZodiacSymbol(zodiac: string | undefined): string | null {
  if (!zodiac) return null;
  return ZODIAC_SYMBOLS[zodiac] || null;
}
