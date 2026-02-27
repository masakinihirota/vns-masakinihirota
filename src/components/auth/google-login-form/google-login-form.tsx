"use client";

import { FcGoogle } from "react-icons/fc";

import { cn } from "@/lib/utils";
import { AuthFormCard } from "@/components/auth/auth-form-card";

import { useGoogleLoginLogic } from "./google-login-form.logic";

/**
 *
 * @param root0
 * @param root0.className
 */
export function GoogleLoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const { error, isLoading, handleSocialLogin, features } =
    useGoogleLoginLogic();

  return (
    <AuthFormCard
      title="Google認証"
      icon={<FcGoogle className="h-6 w-6" />}
      description="必要なもの: Googleアカウント"
      features={features}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSocialLogin}
      ariaLabel="Googleアカウントでサインイン"
      className={cn("flex-1 min-w-0", className)}
    />
  );
}
