"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const USE_REAL_AUTH = process.env.NEXT_PUBLIC_USE_REAL_AUTH === "true";

/**
 * アプリケーション全体の認証状態を管理するカスタムフック
 * 実認証（Better Auth）と Trial モード（Local Storage）を統合して扱います
 *
 * @note モック認証モード（USE_REAL_AUTH=false）では、
 * 保護されたページ（/home等）でのみ認証済み状態を再現します
 */
export function useAppAuth() {
  // モック認証モードでは Better Auth セッションを使用しない
  const realAuthSession = useBetterAuthSession();
  const { data: session, isPending: realIsPending, error } = USE_REAL_AUTH
    ? realAuthSession
    : { data: null, isPending: false, error: null };

  const [isTrialMode, setIsTrialMode] = useState(false);
  const pathname = usePathname();

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

  // モック認証モードでは、保護されたページ（/home等）でのみ認証済みとみなす
  const isProtectedPage = pathname?.startsWith("/home") || pathname?.startsWith("/settings") || pathname?.startsWith("/profile");
  const hasMockAuth = !USE_REAL_AUTH && isProtectedPage;

  // Trial モード、実セッション、またはモック認証がある場合に「ログイン済み」とみなす
  const isAuthenticated = !!session || isTrialMode || hasMockAuth;

  // モック認証モードでは常に isPending = false
  const isPending = USE_REAL_AUTH ? realIsPending : false;

  // 表示用のユーザー名
  let userName = "ゲスト";
  if (isTrialMode) {
    userName = "お試しユーザー";
  } else if (session?.user?.name) {
    userName = session.user.name;
  } else if (hasMockAuth) {
    userName = "テストユーザー1";
  }

  return {
    isAuthenticated,
    isTrialMode,
    session,
    isPending,
    error,
    userName,
  };
}
