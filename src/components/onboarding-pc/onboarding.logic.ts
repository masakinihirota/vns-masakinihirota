"use client";
// Force recompile

import { useState } from "react";
// 都道府県データ
import { Agreements, DETAILED_REGIONS } from "./onboarding.constants";

export * from "./onboarding.constants";

export type LanguageAbilityType = "self" | "ai_assisted";

export interface LanguageAbility {
  type: LanguageAbilityType;
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
