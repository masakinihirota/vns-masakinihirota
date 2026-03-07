import { useState } from "react";

import { signIn } from "@/lib/auth-client";
import { ROUTES } from "@/config/routes";
import { getAuthFeatures } from "@/lib/auth/auth-features";
import { getOAuthErrorInfo, type AuthErrorInfo } from "@/lib/auth/auth-errors";

/**
 * Google ソーシャルログインのカスタムフック
 * Better-Auth の signIn.social API を使用してGoogle OAuth ログインを実行します
 */
export const useGoogleLoginLogic = () => {
  const [error, setError] = useState<AuthErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: ROUTES.HOME,
      });

      if (result.error) {
        const errorInfo = getOAuthErrorInfo(result.error, "google");
        setError(errorInfo);
        setIsLoading(false);
      }
      // 成功時は Better-Auth が自動的にリダイレクトを処理
    } catch (err) {
      const errorInfo = getOAuthErrorInfo(err, "google");
      setError(errorInfo);
      setIsLoading(false);
    }
  };

  // Google認証で得られる機能リスト（一元管理された設定から取得）
  const features = getAuthFeatures("google");

  return {
    error,
    isLoading,
    handleSocialLogin,
    features,
  };
};
