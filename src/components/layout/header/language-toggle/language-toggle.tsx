'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/context/locale-context';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, changeLocale } = useLocale();

  const toggleLocale = () => {
    const newLocale = locale === 'ja' ? 'en' : 'ja';
    changeLocale(newLocale);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLocale}
      aria-label={locale === 'ja' ? '言語を英語に変更' : 'Change language to Japanese'}
      aria-pressed={locale === 'ja'}
      title={locale === 'ja' ? '英語に変更' : 'Change to Japanese'}
      className="shrink-0"
    >
      <Globe className="h-5 w-5" />
      <span className="sr-only">{locale.toUpperCase()}</span>
    </Button>
  );
}
