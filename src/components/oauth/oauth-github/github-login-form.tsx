"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { FaGithub } from "react-icons/fa";

export function GitHubLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/oauth?next=/protected`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
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

  return (
    <div
      className={cn("flex flex-col gap-6 w-full", className)}
      {...props}
    >
      <Card className="border border-green-600 bg-black text-white h-full hover:shadow-md transition-all">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white">
            <FaGithub className="h-6 w-6 text-white" />
            GitHub認証
          </CardTitle>
          <CardDescription className="text-gray-300">
            必要なもの: GitHubアカウント
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
            onSubmit={handleSocialLogin}
            className="mt-6"
          >
            <div className="flex flex-col gap-6">
              {error && (
                <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "ログイン中..." : "サインイン"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
