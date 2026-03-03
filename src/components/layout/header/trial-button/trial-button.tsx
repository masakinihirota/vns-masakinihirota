"use client";

import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/locale-context';
import { logger } from '@/lib/logger';
import { TrialStorage } from '@/lib/trial-storage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function TrialButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const handleStartTrial = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // お試しモードを有効化
      TrialStorage.enableMode();

      toast.info(t('header.redirectingToTrial'), {
        description: 'あなたの星座匿名を作成しましょう',
      });

      // お試しオンボーディングページへ遷移
      router.push('/trial');
      router.refresh();
    } catch (e) {
      toast.error(t('header.trialStartFailed'), {
        description: t('header.checkStorageSettings'),
      });
      logger.error('Trial initialization error:', e instanceof Error ? e : new Error(String(e)));
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="default"
      onClick={handleStartTrial}
      disabled={isLoading}
      aria-label="お試し版を開始"
      className="whitespace-nowrap"
    >
      {isLoading ? '準備中...' : 'お試し体験'}
    </Button>
  );
}
