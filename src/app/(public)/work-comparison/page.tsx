import { WorkProfileComparisonContainer } from "@/components/work-profile-comparison";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "プロフィール比較（作品） | VNS",
  description: "自分と相手の作品の好みを三世（時間軸）で比較分析する",
};

export default function WorkComparisonPage() {
  return (
    <main className="min-h-screen">
      <WorkProfileComparisonContainer />
    </main>
  );
}
