"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbUserQuestion } from "react-icons/tb";

/**
 * 匿名ログインフォームコンポーネント
 * ユーザー情報なしで一時的なアクセスを提供します
 */
export function AnonymousLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnonymousLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInAnonymously();

      if (error) throw error;

      // ログイン成功後にリダイレクト（保護されたルートへ）
      router.push("/protected");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "ログイン中にエラーが発生しました",
      );
      setIsLoading(false);
    }
    console.log("🚀 ~ handleAnonymousLogin ~ error:", error);
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

  return (
    <div
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <Card className="h-full text-white transition-all bg-black border border-green-600 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <TbUserQuestion className="w-6 h-6" />
            匿名認証
          </CardTitle>
          <CardDescription className="text-gray-300">
            必要なもの: 無し
            <br />
            匿名でサービスを体験
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex justify-between"
              >
                <span className="font-medium text-white">{feature.label}:</span>
                <span
                  className={
                    feature.isNegative ? "text-red-500" : "text-green-500"
                  }
                >
                  {feature.value}
                </span>
              </li>
            ))}
          </ul>
          <form
            onSubmit={handleAnonymousLogin}
            className="mt-6"
          >
            <div className="flex flex-col gap-6">
              {error && (
                <p className="p-3 text-sm font-medium text-red-400 rounded-md bg-red-900/30">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "ログイン中..." : "サインイン"}
              </Button>
              <p className="text-xs text-center text-gray-400">
                匿名ログインではデータが永続化されない場合があります
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-400">
            匿名認証では、基本的な機能(データの読み込み、マッチング)のみが利用可能です。データ保存などの一部機能は制限されます。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
