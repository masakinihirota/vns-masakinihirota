import {
  TrialSidebar,
  Footer,
  GlobalHeader,
  MainContent,
} from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 *
 * @param root0
 * @param root0.children
 */
export default function OnboardingTrialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* 左サイドメニュー */}
      <TrialSidebar />

      {/* メインエリア（ヘッダー + コンテンツ + フッター） */}
      <SidebarInset>
        {/* ヘッダーメニュー */}
        <GlobalHeader />

        {/* メインコンテンツ */}
        <MainContent>{children}</MainContent>

        {/* フッターメニュー */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
