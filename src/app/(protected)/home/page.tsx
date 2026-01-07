import { HomeGuide } from "@/components/home/home-guide";
import { HomeMenuGrid } from "@/components/home/home-menu-grid";

export default function DashboardPage() {
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
