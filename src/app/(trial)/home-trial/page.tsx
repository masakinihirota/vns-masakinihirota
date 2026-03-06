import ProtectedHomePage from "@/app/(protected)/home/page";

export const metadata = {
  title: "ホーム (お試し体験)",
  description: "トライアルモードでのホーム画面です",
};

/**
 * トライアル用のホーム画面
 * (protected)/home/page.tsx を再利用しつつ、メタデータを変更
 */
export default function HomeTrialPage() {
  return <ProtectedHomePage />;
}
