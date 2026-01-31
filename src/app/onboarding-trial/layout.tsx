import {
  AppSidebar,
  Footer,
  GlobalHeader,
  MainContent,
} from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function OnboardingTrialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
