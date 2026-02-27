import { ProfileDashboard } from "@/components/profile-display";

/**
 * プロフィール表示ページ
 * (protected) ルート配下に配置されるため、認証チェック済みの前提
 */
export default function ProfileDisplayPage() {
  return (
    <main className="min-h-screen">
      <ProfileDashboard />
    </main>
  );
}
