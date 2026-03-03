import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAuthFeatures } from "@/lib/auth/auth-features";
import { getAnonymousErrorInfo, type AuthErrorInfo } from "@/lib/auth/auth-errors";
import { TrialStorage } from "@/lib/trial-storage";
import { logger } from "@/lib/logger";

/**
 * 匿名ログインのカスタムフック
 * カスタム anonymous endpoint を使用して匿名認証を実行します
 */
export const useAnonymousLoginLogic = () => {
  const [error, setError] = useState<AuthErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // localStorage から試験データと署名を取得
      const trialData = TrialStorage.load();
      const signature = localStorage.getItem("trial_data_signature");

      // リクエストボディを構築
      const body = {
        data: trialData || null,
        signature: signature || null,
      };

      const response = await fetch("/api/auth/sign-in/anonymous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const err = new Error(errorData.error || "ログインに失敗しました");
        const errorInfo = getAnonymousErrorInfo(err);
        setError(errorInfo);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Cookie がセットされたので、指定されたページへリダイレクト
        logger.info("[AnonymousLogin] Success, redirecting to:", data.redirectURL);
        // Note: router.push はノンブロッキングなため、ここで router.push の完了を待つことはできない
        // ローディング状態は UI 上で見える間に自動的に消える（リダイレクトにより）
        router.refresh(); // Force refresh to pick up cookie
        router.push(data.redirectURL);
      } else {
        const err = new Error("認証に失敗しました");
        const errorInfo = getAnonymousErrorInfo(err);
        setError(errorInfo);
        setIsLoading(false);
      }
    } catch (err) {
      const errorInfo = getAnonymousErrorInfo(err);
      setError(errorInfo);
      setIsLoading(false);
    }
  };

  // 匿名認証の機能リスト（一元管理された設定から取得）
  const features = getAuthFeatures("anonymous");

  return {
    error,
    isLoading,
    handleAnonymousLogin,
    features,
  };
};

