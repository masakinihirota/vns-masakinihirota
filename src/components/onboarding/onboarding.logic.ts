"use client";

import { useState } from "react";

// 都道府県データ
export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;

// 文化圏データ型
export type CulturalSphereId =
  | "japanese"
  | "english"
  | "french"
  | "german"
  | "korean"
  | "chinese_traditional"
  | "chinese_simplified"
  | "spanish"
  | "italian"
  | "portuguese"
  | "russian"
  | "other";

export interface CulturalSphere {
  id: CulturalSphereId;
  label: string;
  en: string;
}

export const CULTURAL_SPHERES: CulturalSphere[] = [
  { id: "japanese", label: "日本語文化圏", en: "Japanese" },
  { id: "english", label: "英語文化圏", en: "English" },
  { id: "french", label: "フランス語文化圏", en: "French" },
  { id: "german", label: "ドイツ語文化圏", en: "German" },
  { id: "korean", label: "韓国語文化圏", en: "Korean" },
  {
    id: "chinese_traditional",
    label: "中国語文化圏 (繁体字)",
    en: "Chinese (Traditional)",
  },
  {
    id: "chinese_simplified",
    label: "中国語文化圏 (簡体字)",
    en: "Chinese (Simplified)",
  },
  { id: "spanish", label: "スペイン語文化圏", en: "Spanish" },
  { id: "italian", label: "イタリア語文化圏", en: "Italian" },
  { id: "portuguese", label: "ポルトガル語文化圏", en: "Portuguese" },
  { id: "russian", label: "ロシア語文化圏", en: "Russian" },
  { id: "other", label: "その他の文化圏", en: "Others" },
];

// 文化圏ごとの詳細設定データ
export const DETAILED_REGIONS: Record<
  string,
  { countries: { name: string; regions?: readonly string[] }[] }
> = {
  japanese: {
    countries: [{ name: "日本", regions: PREFECTURES }],
  },
  english: {
    countries: [
      { name: "アメリカ" },
      { name: "イギリス" },
      { name: "カナダ" },
      { name: "オーストラリア" },
      { name: "ニュージーランド" },
      { name: "アイルランド" },
      { name: "インド" },
      { name: "シンガポール" },
      { name: "フィリピン" },
      { name: "その他 (Others)" },
    ],
  },
  french: {
    countries: [
      { name: "フランス" },
      { name: "カナダ" },
      { name: "ベルギー" },
      { name: "スイス" },
      { name: "モナコ" },
      { name: "コンゴ民主共和国" },
      { name: "コートジボワール" },
      { name: "その他 (Others)" },
    ],
  },
  german: {
    countries: [
      { name: "ドイツ" },
      { name: "オーストリア" },
      { name: "スイス" },
      { name: "リヒテンシュタイン" },
      { name: "ルクセンブルク" },
      { name: "その他 (Others)" },
    ],
  },
  korean: {
    countries: [
      { name: "韓国" },
      { name: "北朝鮮" },
      { name: "その他 (Others)" },
    ],
  },
  chinese_traditional: {
    countries: [
      { name: "台湾" },
      { name: "香港" },
      { name: "マカオ" },
      { name: "その他 (Others)" },
    ],
  },
  chinese_simplified: {
    countries: [
      { name: "中国" },
      { name: "シンガポール" },
      { name: "マレーシア" },
      { name: "その他 (Others)" },
    ],
  },
  spanish: {
    countries: [
      { name: "スペイン" },
      { name: "メキシコ" },
      { name: "アルゼンチン" },
      { name: "コロンビア" },
      { name: "ペルー" },
      { name: "チリ" },
      { name: "その他 (Others)" },
    ],
  },
  italian: {
    countries: [
      { name: "イタリア" },
      { name: "スイス" },
      { name: "サンマリノ" },
      { name: "バチカン市国" },
      { name: "その他 (Others)" },
    ],
  },
  portuguese: {
    countries: [
      { name: "ポルトガル" },
      { name: "ブラジル" },
      { name: "アンゴラ" },
      { name: "モザンビーク" },
      { name: "その他 (Others)" },
    ],
  },
  russian: {
    countries: [
      { name: "ロシア" },
      { name: "ベラルーシ" },
      { name: "カザフスタン" },
      { name: "キルギス" },
      { name: "その他 (Others)" },
    ],
  },
  other: {
    countries: [{ name: "その他 (Others)" }],
  },
};

export const GENERATIONS = [
  "1940-1945",
  "1945-1950",
  "1950-1955",
  "1955-1960",
  "1960-1965",
  "1965-1970",
  "1970-1975",
  "1975-1980",
  "1980-1985",
  "1985-1990",
  "1990-1995",
  "1995-2000",
  "2000-2005",
  "2005-2010",
  "2010-2015",
  "2015-2020",
  "2020-2025",
  "2025-2030",
] as const;

// 月の地名データ
export const MOON_LOCATIONS = [
  "静かの海 (Mare Tranquillitatis)",
  "ティコ・クレーター (Tycho)",
  "コペルニクス・クレーター (Copernicus)",
  "嵐の大洋 (Oceanus Procellarum)",
  "雨の海 (Mare Imbrium)",
  "危難の海 (Mare Crisium)",
  "ケプラー・クレーター (Kepler)",
  "アペニン山脈 (Montes Apenninus)",
  "晴れの海 (Mare Serenitatis)",
  "プラトン・クレーター (Plato)",
] as const;

// 火星の地名データ
export const MARS_LOCATIONS = [
  "オリンポス山 (Olympus Mons)",
  "マリネリス峡谷 (Valles Marineris)",
  "大シルチス (Syrtis Major)",
  "タルシス三山 (Tharsis Montes)",
  "ゲール・クレーター (Gale Crater)",
  "イシディス平原 (Isidis Planitia)",
  "ヘラス盆地 (Hellas Planitia)",
  "ジェゼロ・クレーター (Jezero Crater)",
  "ユートピア平原 (Utopia Planitia)",
  "シドニア地域 (Cydonia)",
] as const;

export type LanguageAbilityType = "self" | "ai_assisted";

export interface LanguageAbility {
  type: LanguageAbilityType;
}

export const LANGUAGE_OPTIONS = [
  "日本語 (Japanese)",
  "英語 (English)",
  "フランス語 (French)",
  "ドイツ語 (German)",
  "韓国語 (Korean)",
  "中国語 (繁体字) (Chinese Traditional)",
  "中国語 (簡体字) (Chinese Simplified)",
  "スペイン語 (Spanish)",
  "イタリア語 (Italian)",
  "ポルトガル語 (Portuguese)",
  "ロシア語 (Russian)",
] as const;

export interface Agreements {
  oasis: boolean;
  human: boolean;
  honesty: boolean;
}

export const CORE_ACTIVITY_HOURS = Array.from(
  { length: 24 },
  (_, i) => i.toString().padStart(2, "0") + ":00"
);

export const useOnboarding = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [culturalSphere, setCulturalSphere] = useState<string>("");
  const [birthGeneration, setBirthGeneration] = useState<string>("");

  // 詳細設定用のState
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  // 言語設定用のState
  const [nativeLanguage, setNativeLanguage] = useState<string>("");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // 活動設定用のState
  const [coreActivityStart, setCoreActivityStart] = useState<string>("09:00");
  const [coreActivityEnd, setCoreActivityEnd] = useState<string>("18:00");
  const [useAiTranslation, setUseAiTranslation] = useState<boolean>(true);

  // 同意事項用のState
  const [isAdult, setIsAdult] = useState(false);
  const [agreements, setAgreements] = useState<Agreements>({
    oasis: false,
    human: false,
    honesty: false,
  });

  // 文化圏が変わったら詳細設定をリセット
  const handleCulturalSphereChange = (sphereId: string) => {
    setCulturalSphere(sphereId);
    setSelectedCountry("");
    setSelectedRegion("");
    if (sphereId === "japanese") {
      setSelectedCountry("日本");
    }
  };

  const toggleAvailableLanguage = (lang: string) => {
    setAvailableLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleAgreement = (key: keyof Agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* console.log({
      selectedArea,
      culturalSphere,
      birthGeneration,
      selectedCountry,
      selectedRegion,
      nativeLanguage,
      availableLanguages,
      coreActivityStart,
      coreActivityEnd,
      useAiTranslation,
      isAdult,
      agreements,
    }); */
    alert("アカウント作成リクエストを送信しました（デモ）");
  };

  const canSubmit =
    isAdult && agreements.oasis && agreements.human && agreements.honesty;

  const currentDetail = culturalSphere
    ? DETAILED_REGIONS[culturalSphere]
    : null;

  return {
    state: {
      selectedArea,
      culturalSphere,
      birthGeneration,
      selectedCountry,
      selectedRegion,
      nativeLanguage,
      availableLanguages,
      coreActivityStart,
      coreActivityEnd,
      useAiTranslation,
      isAdult,
      agreements,
      currentDetail,
      canSubmit,
    },
    actions: {
      setSelectedArea,
      setCulturalSphere: handleCulturalSphereChange,
      setBirthGeneration,
      setSelectedCountry,
      setSelectedRegion,
      setNativeLanguage,
      setCoreActivityStart,
      setCoreActivityEnd,
      setUseAiTranslation,
      setIsAdult,
      toggleAvailableLanguage,
      toggleAgreement,
      handleSubmit,
    },
  };
};
