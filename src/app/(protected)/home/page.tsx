import { redirect } from "next/navigation";
import { HomeGuide } from "@/components/home/home-guide";
import { HomeMenuGrid } from "@/components/home/home-menu-grid";
import { hasRootAccount, hasSelectedMode } from "@/lib/auth/root-account-guard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Dev mock user fallback for testing
  const userId =
    user?.id ||
    (process.env.NODE_ENV === "development" ? "dev-mock-user-id" : null);

  if (userId) {
    const hasRoot = await hasRootAccount(userId);
    if (!hasRoot) {
      redirect("/onboarding-pc");
    }

    const hasMode = await hasSelectedMode(userId);
    if (!hasMode) {
      redirect("/onboarding/mode-selection");
    }
  } else if (!user && process.env.NODE_ENV !== "development") {
    // Should be handled by middleware, but safe check
    redirect("/auth/login");
  }
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ホーム</h1>
        <p className="text-muted-foreground">
          VNSプラットフォームへようこそ。利用したい機能を選択してください。
        </p>
      </div>

      <HomeGuide />

      <HomeMenuGrid />
    </div>
  );
}
