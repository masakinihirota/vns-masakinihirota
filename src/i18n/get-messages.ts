import { messages, type Locale } from './messages';

export type { Locale };

/**
 * ロケールに応じたメッセージオブジェクトを取得する
 * @param locale ロケール ('ja' | 'en')
 * @returns メッセージオブジェクト
 */
export function getMessages(locale: Locale) {
  return messages[locale];
}

/**
 * ネストされたメッセージキーから値を取得する
 * @example getMessage('ja', 'header.tryButton') → 'お試し体験'
 */
export function getNestedMessage(
  locale: Locale,
  keyPath: string
): string {
  const keys = keyPath.split('.');
  let current: any = messages[locale];

  for (const key of keys) {
    current = current?.[key];
  }

  return typeof current === 'string' ? current : keyPath;
}

/**
 * デフォルトロケールを取得（ブラウザまたはサーバー）
 */
export function getDefaultLocale(): Locale {
  if (typeof window !== 'undefined') {
    // クライアント側
    const stored = localStorage.getItem('locale');
    if (stored === 'ja' || stored === 'en') return stored;
    return navigator.language.startsWith('ja') ? 'ja' : 'en';
  }
  // サーバー側
  return 'ja';
}
