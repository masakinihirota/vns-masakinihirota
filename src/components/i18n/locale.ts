"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "@/components/i18n/config";

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
// この例では、ロケールはクッキーから読み取られます。
// 代わりに、データベース、バックエンドサービス、または他のソースから取得することも可能です。
const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
