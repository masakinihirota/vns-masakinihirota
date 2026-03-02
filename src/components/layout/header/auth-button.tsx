"use client";

import { Button } from "@/components/ui/button";
import { useAppAuth } from "@/hooks/use-app-auth";
import { Loader2, User } from "lucide-react";
import Link from "next/link";

export function AuthButton() {
  const { isAuthenticated, isTrialMode, isPending, userName } = useAppAuth();

  if (isPending) {
    return (
      <Button variant="outline" disabled aria-label="認証状態を確認中">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        読み込み中
      </Button>
    );
  }

  if (isTrialMode) {
    return (
      <Button variant="ghost" className="relative group" asChild>
        <Link href="/dashboard" aria-label="お試し環境のダッシュボードへ移動">
          <User className="mr-2 h-4 w-4 text-orange-500" />
          <span>お試し中</span>
        </Link>
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/dashboard" aria-label="ダッシュボードへ移動">
          <User className="mr-2 h-4 w-4" />
          <span>アカウント</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="default" asChild>
      <Link href="/sign-in" aria-label="ログイン画面へ移動">
        ログイン
      </Link>
    </Button>
  );
}
