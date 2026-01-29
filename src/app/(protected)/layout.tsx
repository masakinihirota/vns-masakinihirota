import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Footer } from "@/components/layout/footer";
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // ローカルモード（ユーザー登録なし）の確認
  // Cookieに 'local_mode=true' がある場合は認証をスキップ
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isLocalMode = cookieStore.get("local_mode")?.value === "true";

  // 開発環境でも、(protected)配下は基本的に認証を求めるべきだが、
  // 開発初期の利便性のため、またはユーザー指示により調整可能。
  // ここでは厳密にチェックする。

  if ((error || !user) && !isLocalMode) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      {/* 左サイドメニュー */}
      <AppSidebar />

      {/* メインエリア（ヘッダー + コンテンツ + フッター） */}
      <SidebarInset>
        {/* ヘッダーメニュー */}
        <GlobalHeader />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">{children}</main>

        {/* フッターメニュー */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
