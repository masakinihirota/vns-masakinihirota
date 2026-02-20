import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * 匿名ログインのカスタムフック
 * Better-Auth の signIn.anonymous API を使用して匿名認証を実行します
 */
export const useAnonymousLoginLogic = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn.anonymous();

    if (result.error) {
      setError(result.error.message ?? "ログインに失敗しました");
      setIsLoading(false);
      return;
    }

    // ログイン成功後にリダイレクト（保護されたルートへ）
    router.push("/home");
  };

  // 匿名認証の機能リスト
  const features = [
    { label: "ルートアカウント", value: "1" },
    { label: "ユーザープロフィール", value: "3枚" },
    { label: "所持ポイント", value: "500" },
    { label: "価値観登録", value: "NG", isNegative: true },
    { label: "作品登録", value: "NG", isNegative: true },
    { label: "タグ登録", value: "NG", isNegative: true },
    { label: "データ読み込み", value: "OK" },
    { label: "データ保存", value: "NG", isNegative: true },
    { label: "データ削除", value: "NG", isNegative: true },
    { label: "広告", value: "あり強制", isNegative: true },
    { label: "オアシス宣言", value: "なし", isNegative: true },
  ];

  return {
    error,
    isLoading,
    handleAnonymousLogin,
    features,
  };
};
