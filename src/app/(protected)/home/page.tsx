import { redirect } from "next/navigation";
import * as Home from "@/components/home";
import { getSession } from "@/lib/auth/helper";
import { hasRootAccount } from "@/lib/auth/root-account-guard";

/**
 * ホームページ（スタートページ）
 * ログイン後のメインダッシュボード
 */
export default async function HomePage() {
  const session = await getSession();

  // 開発環境用モックユーザーフォールバック
  const userId =
    session?.user?.id ||
    (process.env.NODE_ENV === "development" ? "dev-mock-user-id" : null);

  if (userId) {
    const hasRoot = await hasRootAccount(userId);
    if (!hasRoot) {
      redirect("/onboarding-pc");
    }
  } else if (!session?.user && process.env.NODE_ENV !== "development") {
    redirect("/auth/login");
  }

  return <Home.StartPageContainer />;
}
