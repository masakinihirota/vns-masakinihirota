"use client";

import * as Comparison from "@/components/profile-comparison";

/**
 * プロフィール比較ページ
 *
 * 複数の自己プロファイルと候補者プロファイルを作品軸で比較分析する画面です。
 * 実装は ProfileComparisonContainer に集約されています。
 */
export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Comparison.ProfileComparisonContainer />
    </div>
  );
}
