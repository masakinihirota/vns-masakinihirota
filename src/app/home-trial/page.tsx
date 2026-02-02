import { HomeTrialContainer } from "@/components/home-trial";
import { GlobalHeader, MainContent, TrialSidebar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomeTrialPage() {
  return (
    <SidebarProvider>
      {/* 体験版専用サイドバー */}
      <TrialSidebar />

      <SidebarInset>
        {/* ヘッダーメニュー */}
        <GlobalHeader />

        {/* メインコンテンツ */}
        <MainContent>
          <HomeTrialContainer />
        </MainContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
