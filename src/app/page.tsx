import { LandingPage } from "@/components/landing-page";
import { Header } from "@/components/layout/header/header";

/**
 * ランディングページ（/）
 * /tales-claire と同一コンテンツを表示する
 */
export default function RootLandingPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
    </>
  );
}
