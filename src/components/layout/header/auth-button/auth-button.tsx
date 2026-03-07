"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/context/locale-context";
import { useAppAuth } from "@/hooks/use-app-auth";
import { signOut } from "@/lib/auth-client";
import { ROUTES } from "@/config/routes";
import { logger } from "@/lib/logger";
import { TrialStorage } from "@/lib/trial-storage";
import { Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrialButton } from "../trial-button";

export function AuthButton() {
  const { isAuthenticated, isTrialMode, isPending, userName } = useAppAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 認証状態が変わったらログアウト中状態をリセット
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggingOut(false);
    }
  }, [isAuthenticated]);

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
      router.push(ROUTES.LANDING);
      router.refresh();
    };

    return (
      <div className="flex items-center gap-2">
        {/* お試し中はクリック不可の表示のみ */}
        <div className="flex items-center px-3 py-2 text-sm font-medium text-orange-600 dark:text-orange-400">
          <User className="mr-2 h-4 w-4" />
          <span>{t('header.inTrialMode')}</span>
        </div>
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

        // 通常のログアウト処理
        await signOut();
        router.push(ROUTES.LANDING);
        router.refresh();
      } catch (error) {
        logger.error("ログアウトエラー:", error instanceof Error ? error : undefined);
        setIsLoggingOut(false);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href={ROUTES.HOME} aria-label={t('header.gotoDashboard')}>
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
        <Link href={ROUTES.LOGIN} aria-label={t('header.gotoSignIn')}>
          {t('header.signIn')}
        </Link>
      </Button>
    </div>
  );
}
