/**
 * 始まりの国（Beginning Country）のビジネスロジック
 */

export type BeginningCountryStep = 0 | 1 | 3 | 77 | 88 | 99;

export interface BeginningCountryFormData {
  displayName: string;
  avatar: string;
  format: string;
  role: string;
  purpose: string[];
}

/**
 * 名前候補の生成ロジック
 * 星座に基づいた匿名名を生成する
 */
export const generateNameCandidates = (
  zodiacName: string,
  history: string[][]
): string[] => {
  const colors = [
    "赤い",
    "白い",
    "青い",
    "緑の",
    "黄色い",
    "紫の",
    "黒い",
    "銀の",
    "黄金の",
  ];
  const concepts = [
    "マテリアル",
    "光",
    "幻想",
    "氷",
    "炎",
    "風",
    "闇",
    "星",
    "霧",
  ];

  const lastSet = history.length > 0 ? history[history.length - 1] : [];
  const candidates: string[] = [];

  while (candidates.length < 3) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const concept = concepts[Math.floor(Math.random() * concepts.length)];
    const name = `${color}${concept}の${zodiacName}`;

    // 履歴に含まれず、かつ現在の候補にも含まれない場合のみ追加
    if (!lastSet.includes(name) && !candidates.includes(name)) {
      candidates.push(name);
    }
  }

  return candidates;
};

/**
 * 幽霊状態（Ghost Mode）での制限判定
 * 特定のレベル未満の場合は書き込み・編集を制限する
 */
export const isReadOnlyMode = (level: number): boolean => {
  // ゲーミフィケーション設計書に基づき、Lv2（プロフィール作成）未満は制限付き
  // ただし、幽霊モードの定義（観測者）に準じ、特定の権限を持っていない限り書き込み禁止
  return level < 2;
};

export const ZODIAC_DATA = {
  Aries: { name: "牡羊座", emoji: "♈" },
  Taurus: { name: "牡牛座", emoji: "♉" },
  Gemini: { name: "双子座", emoji: "♊" },
  Cancer: { name: "蟹座", emoji: "♋" },
  Leo: { name: "獅子座", emoji: "♌" },
  Virgo: { name: "乙女座", emoji: "♍" },
  Libra: { name: "天秤座", emoji: "♎" },
  Scorpio: { name: "蠍座", emoji: "♏" },
  Sagittarius: { name: "射手座", emoji: "♐" },
  Capricorn: { name: "山羊座", emoji: "♑" },
  Aquarius: { name: "水瓶座", emoji: "♒" },
  Pisces: { name: "魚座", emoji: "♓" },
} as const;
