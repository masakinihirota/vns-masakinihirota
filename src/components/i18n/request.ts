import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    // messages: (await import(`./messages/${locale}.json`)).default,
    // メッセージを複数のファイルから読み込み、結合します。
    // スプレッド構文（...）を使ってメッセージを一つのオブジェクトに結合しています。
    messages: {
      // 共通のメッセージ
      ...(await import(`./messages/${locale}.json`)).default,
      // 個別ページ用のメッセージ
      ...(await import(`./messages/${locale}/home-page.json`)).default,
      ...(await import(`./messages/${locale}/locale-switcher.json`)).default,
    },
  };
});
