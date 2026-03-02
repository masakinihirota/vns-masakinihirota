import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// サポートするロケール
export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // locale が有効かバリデーション
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
