"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInAnonymouslyAndRedirect() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Anonymous login error:", error);
    // エラー時はログインページへ誘導
    redirect("/login?error=anonymous_sign_in_failed");
  }

  // 成功時は人気作品ページへ
  redirect("/works/popular");
}
