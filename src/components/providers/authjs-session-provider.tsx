"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Auth.js SessionProvider ラッパーコンポーネント
 * ルートレイアウトでAuth.jsセッション情報を提供する
 */
export function AuthjsSessionProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SessionProvider>{children}</SessionProvider>;
}
