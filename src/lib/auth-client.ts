import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Better-Auth クライアントサイド設定
 *
 * `NEXT_PUBLIC_APP_URL` が本番環境で確実に設定されていることを確認してください。
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    anonymousClient(), // 匿名認証クライアントプラグイン
  ],
});

/**
 * クライアントサイドで使用する認証フックと関数
 * - signIn: ログイン（social, anonymous 含む）
 * - signUp: 新規登録
 * - signOut: ログアウト
 * - useSession: セッション状態の取得
 */
export const { signIn, signUp, signOut, useSession, getSession } = authClient;
