"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * 匿名ログインを実行し、人気作品ページへリダイレクトする Server Action
 * Better-Auth のサーバー API を使用します
 */
export async function signInAnonymouslyAndRedirect() {
  const result = await auth.api.signInAnonymous({
    headers: await headers(),
  });

  if (!result) {
    console.error("匿名ログインに失敗しました");
    // エラー時はログインページへ誘導
    redirect("/login?error=anonymous_sign_in_failed");
  }

  // 成功時は人気作品ページへ
  redirect("/works/popular");
}
