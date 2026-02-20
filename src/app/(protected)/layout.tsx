import {
  AppSidebar,
  ConditionalFooter,
  GlobalHeader,
  MainContent,
} from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 開発環境での認証バイパス
  const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";

  if (!isAuthDisabled) {
    // Better-Auth によるセッションチェック
    const session = await getSession();
    if (!session) {
      redirect("/login");
    }
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
        <MainContent>{children}</MainContent>

        {/* フッターメニュー */}
        <ConditionalFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
