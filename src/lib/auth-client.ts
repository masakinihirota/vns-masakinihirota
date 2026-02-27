import { createAuthClient } from "better-auth/react";
// -----------------------------------------------------------
// Client SDK
// 一般的なユーザー操作（トリガー）はこのSDKがカバーする
// -----------------------------------------------------------
// ログイン (signIn)
// 新規登録 (signUp)
// ログアウト (signOut)
// -- 非推奨 -------------------------------------------------
// クライアント側でのセッション取得 (useSession) ※ React Hook (監視用: UI連動)
// クライアント側でのセッション取得 (getSession) ※ Async Func (点呼用: イベント時)
// ※ データ取得は原則 Server Components (Page/Layout) で行い、Propsで渡すこと
// -----------------------------------------------------------
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // 例: http://localhost:3000
});

export const { signIn, signUp, signOut } = authClient;
