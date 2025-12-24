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
    countries: [{ name: "日本 (Japan)", regions: PREFECTURES }],
  },
  english: {
    countries: [
      { name: "アメリカ合衆国 (USA)" },
      { name: "イギリス (UK)" },
      { name: "カナダ (Canada)" },
      { name: "オーストラリア (Australia)" },
      { name: "その他 (Others)" },
    ],
  },
};

export const GENERATIONS = [
  "1940年代以前",
  "1950年代",
  "1960年代",
  "1970年代",
  "1980年代",
  "1990年代",
  "2000年代",
  "2010年代",
  "2020年代以降",
] as const;

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
      setSelectedCountry("日本 (Japan)");
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
      setIsAdult,
      toggleAvailableLanguage,
      toggleAgreement,
      handleSubmit,
    },
  };
};
