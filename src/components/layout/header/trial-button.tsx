"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/locale-context';
import { useState } from 'react';
import { toast } from 'sonner';
import { generateRandomAnonymousName, TrialStorage } from '@/lib/trial-storage';
import { logger } from '@/lib/logger';

export function TrialButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useLocale();

  const handleStartTrial = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ランダム名を生成
      const anonymousName = generateRandomAnonymousName();

      // お試しデータを初期化・保存
      const trialData = TrialStorage.init();
      trialData.rootAccount = {
        display_id: anonymousName,
        display_name: anonymousName,
        activity_area_id: null,
        core_activity_start: '09:00',
        core_activity_end: '18:00',
        holidayActivityStart: '10:00',
        holidayActivityEnd: '19:00',
        uses_ai_translation: false,
        nativeLanguages: ['ja'],
        agreed_oasis: true,
        zodiac_sign: '水瓶座',
        birth_generation: '平成',
        week_schedule: {
          mon: 'work',
          tue: 'work',
          wed: 'work',
          thu: 'work',
          fri: 'work',
          sat: 'leisure',
          sun: 'leisure',
        },
        created_at: new Date().toISOString(),
      };
      TrialStorage.save(trialData);

      toast.success(`${anonymousName} ${t('header.startedTrial')}`, {
        description: '※このモード中のデータはブラウザのみに保存され、サーバーには送信されません',
      });

      // ダッシュボードへ遷移
      router.push('/home');
      router.refresh();
    } catch (e) {
      toast.error(t('header.trialStartFailed'), {
        description: t('header.checkStorageSettings'),
      });
      logger.error('Trial initialization error:', e);
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
