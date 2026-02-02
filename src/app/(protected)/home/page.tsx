import { redirect } from "next/navigation";
import * as Home from "@/components/home";
import {
  getRootAccountId,
  hasRootAccount,
} from "@/lib/auth/root-account-guard";
import { createClient } from "@/lib/supabase/server";

/**
 * ホームページ（スタートページ）
 * ログイン後のメインダッシュボード
 */
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 開発環境用モックユーザーフォールバック
  const userId =
    user?.id ||
    (process.env.NODE_ENV === "development" ? "dev-mock-user-id" : null);

  if (userId) {
    const hasRoot = await hasRootAccount(userId);
    if (!hasRoot) {
      redirect("/onboarding-pc");
    }
    await getRootAccountId(userId);
  } else if (!user && process.env.NODE_ENV !== "development") {
    redirect("/auth/login");
  }

  return <Home.StartPageContainer />;
}
