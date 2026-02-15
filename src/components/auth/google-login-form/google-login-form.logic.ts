import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export const useGoogleLoginLogic = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Google認証ロジック
    // クライアントサイドでのSupabaseクライアント作成
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/home`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Google認証で得られる機能リスト（表示用データ）
  const features = [
    { label: "ルートアカウント", value: "1", isNegative: false },
    { label: "ユーザープロフィール", value: "10枚", isNegative: false },
    { label: "所持ポイント", value: "1000", isNegative: false },
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
