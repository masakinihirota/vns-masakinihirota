"use client";

import { TrialRootAccount, TrialStorage } from "@/lib/trial-storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { OnboardingIdentity } from "./onboarding-identity";
import { Identity, useOnboardingIdentityLogic } from "./onboarding-identity.logic";

export function OnboardingIdentityContainer() {
  const router = useRouter();
  const { generateIdentityObject } = useOnboardingIdentityLogic();

  // 初期表示用のランダムアイデンティティ
  const [tempIdentity, setTempIdentity] = useState<Identity>(() => ({
    name: 'ランダム',
    sign: null,
    color: null,
    isRandom: true
  }));

  const handleSelectIdentity = useCallback((identity: Identity) => {
    setTempIdentity(identity);
  }, []);

  const handleConfirmIdentity = useCallback((identity: Identity) => {
    try {
      // TrialRootAccount形式に変換して保存
      const rootAccount: TrialRootAccount = {
        display_id: identity.name.split('#')[1] || "00",
        display_name: identity.name.split('#')[0],
        zodiac_sign: identity.sign || "不明",
        color: identity.color,
        // その他の必須項目をデフォルト値で埋める
        core_activity_start: "09:00",
        core_activity_end: "18:00",
        holidayActivityStart: "10:00",
        holidayActivityEnd: "20:00",
        uses_ai_translation: false,
        nativeLanguages: ["Japanese"],
        agreed_oasis: true,
        birth_generation: "1990s",
        week_schedule: {},
        created_at: new Date().toISOString(),
      };

      TrialStorage.setRootAccount(rootAccount);
      TrialStorage.enableMode();

      toast.success("匿名のアイデンティティを保存しました");

      // /home-trial への遷移
      router.push("/home-trial");
    } catch (error) {
      console.error("Failed to confirm identity:", error);
      toast.error("保存に失敗しました");
    }
  }, [router]);

  return (
    <OnboardingIdentity
      tempIdentity={tempIdentity}
      onSelect={handleSelectIdentity}
      onConfirm={handleConfirmIdentity}
    />
  );
}
