"use client";

import { TbUserQuestion } from "react-icons/tb";

import { cn } from "@/lib/utils";
import { AuthFormCard } from "@/components/auth/auth-form-card";

import { useAnonymousLoginLogic } from "./anonymous-login-form.logic";

/**
 * 匿名ログインフォームコンポーネント
 * ユーザー情報なしで一時的なアクセスを提供します
 * @param root0
 * @param root0.className
 */
export function AnonymousLoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const { error, isLoading, handleAnonymousLogin, features } =
    useAnonymousLoginLogic();

  return (
    <AuthFormCard
      title="匿名認証"
      icon={<TbUserQuestion className="w-6 h-6" />}
      description={
        <>
          必要なもの: 無し
          <br />
          匿名でサービスを体験
        </>
      }
      features={features}
      error={error}
      isLoading={isLoading}
      onSubmit={handleAnonymousLogin}
      ariaLabel="匿名でサインイン"
      footer={
        <p className="text-sm text-center text-gray-400">
          匿名認証では、基本的な機能(データの読み込み、マッチング)のみが利用可能です。データ保存などの一部機能は制限されます。
        </p>
      }
      className={cn("flex-1 min-w-0", className)}
    />
  );
}
