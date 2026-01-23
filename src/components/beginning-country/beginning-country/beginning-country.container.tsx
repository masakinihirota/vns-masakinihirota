"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { BeginningCountry } from "./beginning-country";
import {
  BeginningCountryStep,
  BeginningCountryFormData,
  generateNameCandidates,
  ZODIAC_DATA,
} from "./beginning-country.logic";

interface BeginningCountryContainerProps {
  userId: string;
  zodiacSign: string; // "Scorpio" etc.
}

export function BeginningCountryContainer({
  userId: _userId,
  zodiacSign,
}: BeginningCountryContainerProps) {
  const router = useRouter();
  const zodiac =
    ZODIAC_DATA[zodiacSign as keyof typeof ZODIAC_DATA] || ZODIAC_DATA.Scorpio;

  const [currentStep, setCurrentStep] = useState<BeginningCountryStep>(0);
  const [formData, setFormData] = useState<BeginningCountryFormData>({
    displayName: "",
    avatar: zodiac.emoji,
    format: "profile",
    role: "member",
    purpose: ["play_purpose"],
  });

  const [nameCandidates, setNameCandidates] = useState<string[]>([]);
  const [nameHistory, setNameHistory] = useState<string[][]>([]);
  const [isRotating, setIsRotating] = useState(false);

  // 初回の名前候補生成
  useEffect(() => {
    handleGenerateNames(false);
  }, []);

  const handleGenerateNames = (isNew = true) => {
    setIsRotating(true);
    setTimeout(() => {
      if (isNew && nameCandidates.length > 0) {
        setNameHistory((prev) => [...prev, nameCandidates]);
      }
      const newCandidates = generateNameCandidates(zodiac.name, nameHistory);
      setNameCandidates(newCandidates);

      // 未選択または候補から外れた場合は1つ目をデフォルトに
      if (!newCandidates.includes(formData.displayName)) {
        setFormData((prev) => ({ ...prev, displayName: newCandidates[0] }));
      }
      setIsRotating(false);
    }, 500);
  };

  const handleRestoreNames = () => {
    if (nameHistory.length === 0) return;
    setIsRotating(true);
    setTimeout(() => {
      const prevSet = nameHistory[nameHistory.length - 1];
      const newHistory = nameHistory.slice(0, -1);
      setNameCandidates(prevSet);
      setNameHistory(newHistory);
      setFormData((prev) => ({ ...prev, displayName: prevSet[0] }));
      setIsRotating(false);
    }, 300);
  };

  const handleUpdateForm = (data: Partial<BeginningCountryFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleStepChange = (step: BeginningCountryStep) => {
    if (step === 99) {
      // 幽霊モード選択時の処理
      // NOTE: 本来はプロフィールの有無に応じたリダイレクト先を決定
      // ユーザーの指示に従い、書き込み制限付きのダッシュボードへ遷移
      // router.push("/home?restricted=true"); など
      alert("幽霊モードで観測に出発します（制限付きダッシュボードへ遷移）");
      router.push("/home");
      return;
    }

    if (step === 88) {
      // チュートリアル選択時
      alert("導き手の元へ案内します（チュートリアル開始）");
      router.push("/home?tutorial=true");
      return;
    }

    if (step === 77) {
      // ゲーミフィケーション中止選択時
      alert(
        "ゲーミフィケーションを中止し、自由行動モードで開始します（レベル制限を解除しますが、相互作用にはプロフィールが必要です）"
      );
      router.push("/home?gamification=false");
      return;
    }

    if (currentStep === 3 && step === 3) {
      // 受肉（プロフィール作成）の実行
      void handleIncarnate();
      return;
    }

    setCurrentStep(step);
  };

  const handleIncarnate = async () => {
    // TODO: Supabase API を使用してプロフィールを作成
    // supabase.from('user_profiles').insert({...})
    alert("仮面を被り、世界へ受肉しました。プロフィールを登録します。");
    router.push("/home");
  };

  return (
    <BeginningCountry
      currentStep={currentStep}
      onStepChange={handleStepChange}
      formData={formData}
      onUpdateForm={handleUpdateForm}
      nameCandidates={nameCandidates}
      onGenerateNames={() => handleGenerateNames(true)}
      onRestoreNames={handleRestoreNames}
      isRotating={isRotating}
      canRestore={nameHistory.length > 0}
      zodiac={zodiac}
    />
  );
}
