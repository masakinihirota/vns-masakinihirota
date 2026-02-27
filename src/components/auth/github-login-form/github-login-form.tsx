"use client";

import { FaGithub } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { AuthFormCard } from "@/components/auth/auth-form-card";

import { useGitHubLoginLogic } from "./github-login-form.logic";

/**
 *
 * @param root0
 * @param root0.className
 */
export function GitHubLoginForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const { error, isLoading, handleSocialLogin, features } =
    useGitHubLoginLogic();

  return (
    <AuthFormCard
      title="GitHub認証"
      icon={<FaGithub className="h-6 w-6 text-white" />}
      description="必要なもの: GitHubアカウント"
      features={features}
      error={error}
      isLoading={isLoading}
      onSubmit={handleSocialLogin}
      ariaLabel="GitHubアカウントでサインイン"
      className={cn("flex-1 min-w-0", className)}
    />
  );
}
