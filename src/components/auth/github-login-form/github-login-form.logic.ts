import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export const useGitHubLoginLogic = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

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
