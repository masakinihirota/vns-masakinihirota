"use client";

import { useAppAuth } from "@/hooks/use-app-auth";
import { useLocale } from "@/context/locale-context";
import { Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrialButton } from "./trial-button";
import { useRouter } from "next/navigation";
import { TrialStorage } from "@/lib/trial-storage";
import { signOut } from "@/lib/auth-client";
import { logger } from "@/lib/logger";
import { useState } from "react";

export function AuthButton() {
  const { isAuthenticated, isTrialMode, isPending, userName } = useAppAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (isPending) {
    return (
      <Button variant="outline" disabled aria-label={t('header.checkingAuth')}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {t('header.loading')}
      </Button>
    );
  }

  if (isTrialMode) {
    const handleStopTrial = () => {
      // clear all trial data and flag then refresh
      TrialStorage.clear();
      router.push('/');
      router.refresh();
    };

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="relative group" asChild>
          <Link href="/home" aria-label={t('header.gotoTrialDashboard')}>
            <User className="mr-2 h-4 w-4 text-orange-500" />
            <span>{t('header.inTrialMode')}</span>
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleStopTrial} aria-label={t('header.stopTrial')}>
          {t('header.stopTrial')}
        </Button>
      </div>
    );
  }

  if (isAuthenticated) {
    const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
        // clear trial data before signing out
        TrialStorage.clear();
        await signOut();
        router.push("/");
        router.refresh();
      } catch (error) {
        logger.error("ログアウトエラー:", error);
        setIsLoggingOut(false);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/home" aria-label={t('header.gotoDashboard')}>
            <User className="mr-2 h-4 w-4" />
            <span>{t('header.account')}</span>
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          aria-label="ログアウト"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ログアウト中...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </>
          )}
        </Button>
      </div>
    );
  }

  // 未認証時: ログインボタン or お試し開始ボタン
  return (
    <div className="flex items-center gap-2">
      <TrialButton />
      <Button variant="default" asChild>
        <Link href="/login" aria-label={t('header.gotoSignIn')}>
          {t('header.signIn')}
        </Link>
      </Button>
    </div>
  );
}
