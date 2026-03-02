"use client";

import { useAppAuth } from "@/hooks/use-app-auth";
import { useLocale } from "@/context/locale-context";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrialButton } from "./trial-button";

export function AuthButton() {
  const { isAuthenticated, isTrialMode, isPending, userName } = useAppAuth();
  const { t } = useLocale();

  if (isPending) {
    return (
      <Button variant="outline" disabled aria-label={t('header.checkingAuth')}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t('header.loading')}
      </Button>
    );
  }

  if (isTrialMode) {
    return (
      <Button variant="ghost" className="relative group" asChild>
        <Link href="/dashboard" aria-label={t('header.gotoTrialDashboard')}>
          <User className="mr-2 h-4 w-4 text-orange-500" />
          <span>{t('header.inTrialMode')}</span>
        </Link>
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/dashboard" aria-label={t('header.gotoDashboard')}>
          <User className="mr-2 h-4 w-4" />
          <span>{t('header.account')}</span>
        </Link>
      </Button>
    );
  }

  // 未認証時: ログインボタン or お試し開始ボタン
  return (
    <div className="flex items-center gap-2">
      <TrialButton />
      <Button variant="default" asChild>
        <Link href="/sign-in" aria-label={t('header.gotoSignIn')}>
          {t('header.signIn')}
        </Link>
      </Button>
    </div>
  );
}
