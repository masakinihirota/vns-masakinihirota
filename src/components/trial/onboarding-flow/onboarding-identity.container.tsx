"use client";

import { logger } from "@/lib/logger";
import { TrialRootAccount, TrialStorage } from "@/lib/trial-storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { OnboardingIdentity } from "./onboarding-identity";
import { Identity, useOnboardingIdentityLogic } from "./onboarding-identity.logic";

function HomeTransitionSkeleton({ name }: { name: string }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl dark:border-slate-700 dark:bg-slate-900/90">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mb-8 h-10 w-72 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />

          <div className="mb-6 flex items-center gap-3">
            <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {name} さんのホームを準備しています...
            </p>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-10/12 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingIdentityContainer() {
  const router = useRouter();
  const { generateIdentityObject } = useOnboardingIdentityLogic();
  const [isTransitioningToHome, setIsTransitioningToHome] = useState(false);
  const [confirmedDisplayName, setConfirmedDisplayName] = useState("");

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
    if (isTransitioningToHome) return;

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

      // スケルトン表示後に /home-trial へ遷移
      setConfirmedDisplayName(rootAccount.display_name);
      setIsTransitioningToHome(true);
      globalThis.setTimeout(() => {
        router.push("/home-trial");
      }, 900);
    } catch (error) {
      logger.error("Failed to confirm identity", error instanceof Error ? error : new Error(String(error)));
      toast.error("保存に失敗しました");
    }
  }, [isTransitioningToHome, router]);

  if (isTransitioningToHome) {
    return <HomeTransitionSkeleton name={confirmedDisplayName} />;
  }

  return (
    <OnboardingIdentity
      tempIdentity={tempIdentity}
      onSelect={handleSelectIdentity}
      onConfirm={handleConfirmIdentity}
    />
  );
}
