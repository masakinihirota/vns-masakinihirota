import { useSession as useBetterAuthSession } from "better-auth/react";
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
      const trialMode = localStorage.getItem("vns_trial_mode") === "true";
      setIsTrialMode(trialMode);
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
