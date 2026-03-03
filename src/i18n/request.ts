import { getRequestConfig } from 'next-intl/server';

// サポートするロケール
export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

// メッセージをインライン定義して patch エラーを回避
import jaMessages from '../../messages/ja.json';
import enMessages from '../../messages/en.json';

const messages: Record<string, any> = {
  ja: jaMessages,
  en: enMessages,
};

export default getRequestConfig(async ({ locale }) => {
  // デフォルトを 'ja' に
  const currentLocale = (locales.includes(locale as Locale) ? locale : 'ja') as Locale;

  return {
    messages: messages[currentLocale],
  };
});
