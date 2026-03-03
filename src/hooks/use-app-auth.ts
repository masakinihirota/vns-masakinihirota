"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

/**
 * アプリケーション全体の認証状態を管理するカスタムフック
 * 実認証（Better Auth）と Trial モード（Local Storage）を統合して扱います
 */
export function useAppAuth() {
  const { data: session, isPending, error } = useBetterAuthSession();
  const [isTrialMode, setIsTrialMode] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== "undefined") {
      const checkTrialMode = () => {
        const trialMode = localStorage.getItem("vns_trial_mode") === "true";
        setIsTrialMode(trialMode);
      };

      // 初回チェック
      checkTrialMode();

      // storage イベントをリスンして他のタブでの変更を検知
      window.addEventListener("storage", checkTrialMode);

      // カスタムイベントで同一タブ内での変更も検知
      const handleTrialModeChange = () => checkTrialMode();
      window.addEventListener("trialModeChanged", handleTrialModeChange);

      return () => {
        window.removeEventListener("storage", checkTrialMode);
        window.removeEventListener("trialModeChanged", handleTrialModeChange);
      };
    }
  }, []);

  // Trial モード、または実セッションがある場合に「ログイン済み」とみなす
  const isAuthenticated = !!session || isTrialMode;

  // 表示用のユーザー名
  const userName = isTrialMode ? "お試しユーザー" : session?.user?.name || "ゲスト";

  return {
    isAuthenticated,
    isTrialMode,
    session,
    isPending,
    error,
    userName,
  };
}
