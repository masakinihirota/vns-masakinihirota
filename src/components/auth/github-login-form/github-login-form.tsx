"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { useGitHubLoginLogic } from "./github-login-form.logic";

export function GitHubLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { error, isLoading, handleSocialLogin, features } = useGitHubLoginLogic();

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
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
            {features.map((feature) => (
              <li key={feature.label} className="flex justify-between">
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
          <form onSubmit={handleSocialLogin} className="mt-6">
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
