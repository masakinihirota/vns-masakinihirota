import { redirect } from "next/navigation";
import { HomeGuide } from "@/components/home/home-guide";
import { HomeMenuGrid } from "@/components/home/home-menu-grid";
import { PopularWorksView } from "@/components/works/popular-works-view";
import {
  hasRootAccount,
  hasSelectedMode,
  getRootAccountId,
} from "@/lib/auth/root-account-guard";
import { getUserProfiles } from "@/lib/db/user-profiles";
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

  let rootAccountId: string | null = null;
  if (userId) {
    const hasRoot = await hasRootAccount(userId);
    if (!hasRoot) {
      redirect("/onboarding-pc");
    }
    rootAccountId = await getRootAccountId(userId);

    const hasMode = await hasSelectedMode(userId);
    if (!hasMode) {
      redirect("/onboarding/mode-selection");
    }
  } else if (!user && process.env.NODE_ENV !== "development") {
    redirect("/auth/login");
  }

  // プロフィール存在チェック
  const profiles = rootAccountId ? await getUserProfiles(rootAccountId) : [];
  const hasProfile = profiles.length > 0;

  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          Dashboard <span className="text-indigo-500">Portal</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          VNSプラットフォームへようこそ。利用したい機能を選択してください。
        </p>
      </div>

      <HomeGuide />
      <HomeMenuGrid />
    </div>
  );
}
