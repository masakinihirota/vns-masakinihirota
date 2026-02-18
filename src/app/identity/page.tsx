/**
 * @file src/app/identity/page.tsx
 * @description アイデンティティ可視化ページ
 */

import * as Identity from "@/components/identity-visualization";

export const metadata = {
  title: "Identity Visualization | 千の仮面",
  description: "ユーザー本体と複数の仮面（プロフィール）の関係を視覚化します。",
};

export default function IdentityPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[85vh]">
        <Identity.IdentityVisualizationContainer />
      </div>
    </div>
  );
}
