import { useState } from "react";

import { signIn } from "@/lib/auth-client";
import { getAuthFeatures } from "@/lib/auth/auth-features";
import { getOAuthErrorInfo, type AuthErrorInfo } from "@/lib/auth/auth-errors";

/**
 * GitHub ソーシャルログインのカスタムフック
 * Better-Auth の signIn.social API を使用してGitHub OAuth ログインを実行します
 */
export const useGitHubLoginLogic = () => {
  const [error, setError] = useState<AuthErrorInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (result.error) {
        const errorInfo = getOAuthErrorInfo(result.error, "github");
        setError(errorInfo);
        setIsLoading(false);
      }
      // 成功時は Better-Auth が自動的にリダイレクトを処理
    } catch (err) {
      const errorInfo = getOAuthErrorInfo(err, "github");
      setError(errorInfo);
      setIsLoading(false);
    }
  };

  // GitHub認証で得られる機能リスト（一元管理された設定から取得）
  const features = getAuthFeatures("github");

  return {
    error,
    isLoading,
    handleSocialLogin,
    features,
  };
};
