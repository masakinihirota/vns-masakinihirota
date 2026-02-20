import { signIn } from "@/lib/auth-client";
import { useState } from "react";

/**
 * GitHub ソーシャルログインのカスタムフック
 * Better-Auth の signIn.social API を使用してGitHub OAuth ログインを実行します
 */
export const useGitHubLoginLogic = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn.social({
      provider: "github",
      callbackURL: "/home",
    });

    if (result.error) {
      setError(result.error.message ?? "ログインに失敗しました");
      setIsLoading(false);
    }
    // 成功時は Better-Auth が自動的にリダイレクトを処理
  };

  // GitHub認証で得られる機能リスト（表示用データ）
  const features = [
    { label: "ルートアカウント", value: "1", isNegative: false },
    { label: "ユーザープロフィール", value: "15枚", isNegative: false },
    { label: "所持ポイント", value: "2500", isNegative: false },
    { label: "価値観登録", value: "OK", isNegative: false },
    { label: "作品登録", value: "OK", isNegative: false },
    { label: "タグ登録", value: "OK", isNegative: false },
    { label: "データ読み込み", value: "OK", isNegative: false },
    { label: "データ保存", value: "OK", isNegative: false },
    { label: "データ削除", value: "OK", isNegative: false },
    { label: "広告", value: "選択可能", isNegative: false },
    { label: "オアシス宣言", value: "あり", isNegative: false },
  ];

  return {
    error,
    isLoading,
    handleSocialLogin,
    features,
  };
};
