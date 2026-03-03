/**
 * 星座に基づく匿名名生成ユーティリティ
 */

// マテリアル定数
export const MATERIALS = [
  "マテリアル", "光", "幻想", "氷", "炎", "輝き", "熱狂", "闇", "風", "水", "土", "雷", "音", "光速", "宇宙",
] as const;

// 色定数
export const COLORS = [
  "赤い", "青い", "黄色い", "緑の", "紫の", "橙色の", "ピンクの", "茶色の", "灰色の", "黒い", "白い",
] as const;

// 星座定数
export const CONSTELLATIONS = [
  "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座",
] as const;

// 星座に対応する記号マップ
export const ZODIAC_SYMBOLS: Record<string, string> = {
  牡羊座: "♈", 牡牛座: "♉", 双子座: "♊", 蟹座: "♋", 獅子座: "♌", 乙女座: "♍",
  天秤座: "♎", 蠍座: "♏", 射手座: "♐", 山羊座: "♑", 水瓶座: "♒", 魚座: "♓",
} as const;

export const ZODIAC_MAPPING: Record<string, string> = {
  aries: "牡羊座", taurus: "牡牛座", gemini: "双子座", cancer: "蟹座", leo: "獅子座", virgo: "乙女座",
  libra: "天秤座", scorpio: "蠍座", sagittarius: "射手座", capricorn: "山羊座", aquarius: "水瓶座", pisces: "魚座",
} as const;

/**
 * 星座に基づいてランダムな匿名名を生成する
 * 形式: [色][マテリアル]の[星座]
 * 例: "赤い熱狂の獅子座"
 */
export function generateAnonymousName(zodiac: string): string {
  const japaneseZodiac = ZODIAC_MAPPING[zodiac.toLowerCase()] || zodiac;

  if (!CONSTELLATIONS.includes(japaneseZodiac as any)) {
    return japaneseZodiac;
  }

  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const randomMaterial = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];

  return `${randomColor}${randomMaterial}の${japaneseZodiac}`;
}

/**
 * 複数のユニークな匿名名候補を生成する
 */
export function generateUniqueCandidates(
  zodiac: string,
  count: number,
  exclude: string[] = []
): string[] {
  const candidates: string[] = [];
  const japaneseZodiac = ZODIAC_MAPPING[zodiac.toLowerCase()] || zodiac;

  const MAX_ATTEMPTS = 50;
  let attempts = 0;

  while (candidates.length < count && attempts < MAX_ATTEMPTS) {
    const name = generateAnonymousName(japaneseZodiac);
    if (!exclude.includes(name) && !candidates.includes(name)) {
      candidates.push(name);
    }
    attempts++;
  }

  return candidates;
}

/**
 * 星座名から対応する記号を取得する
 */
export function getZodiacSymbol(zodiac: string | undefined): string | null {
  if (!zodiac) return null;
  return ZODIAC_SYMBOLS[zodiac] || null;
}

/**
 * 星座名から対応する背景色やアクセントカラーを取得する
 */
export function getZodiacColor(zodiac: string | undefined): string {
  if (!zodiac) return 'from-blue-600 to-purple-600';
  const mapping: Record<string, string> = {
    牡羊座: 'from-red-600 to-orange-600',
    牡牛座: 'from-green-600 to-emerald-600',
    双子座: 'from-yellow-500 to-amber-500',
    蟹座: 'from-blue-400 to-indigo-400',
    獅子座: 'from-orange-500 to-red-500',
    乙女座: 'from-teal-500 to-cyan-500',
    天秤座: 'from-pink-500 to-rose-500',
    蠍座: 'from-purple-700 to-indigo-900',
    射手座: 'from-indigo-600 to-blue-700',
    山羊座: 'from-slate-600 to-stone-700',
    水瓶座: 'from-cyan-600 to-blue-500',
    魚座: 'from-violet-500 to-fuchsia-600',
  };
  return mapping[zodiac] || 'from-blue-600 to-purple-600';
}
