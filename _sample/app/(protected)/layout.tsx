import { redirect } from "next/navigation";

import {
  AppSidebar,
  ConditionalFooter,
  GlobalHeader,
  MainContent,
} from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/helper";

/**
 *
 * @param root0
 * @param root0.children
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 開発環境での認証バイパス
  const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  let currentUser: Awaited<ReturnType<typeof getSession>>["user"] | null = null;

  if (!isAuthDisabled) {
    try {
      // Better-Auth によるセッションチェック
      const session = await getSession();
      if (!session) {
        console.log("[AuthLayout] No session found, redirecting to login");
        redirect("/login");
      } else {
        console.log("[AuthLayout] Session valid for user:", session.user.id);
        currentUser = session.user;
      }
    } catch (error) {
      // セッション取得エラーの場合もログインページへ
      console.error("Auth layout error:", error);
      redirect("/login");
    }
  }

  return (
    <SidebarProvider>
      {/* 左サイドメニュー */}
      <AppSidebar currentUser={currentUser} />

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
