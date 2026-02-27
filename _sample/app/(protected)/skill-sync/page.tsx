import { Metadata } from "next";

import * as SkillSync from "@/components/skill-sync";

export const metadata: Metadata = {
  title: "スキル同期 マンダラチャート | VNS Protocol",
  description:
    "ユーザーとターゲットのスキル習得状況を 3x3 マンダラチャートで可視化・同期します。",
};

/**
 * スキル同期ページ (Skill Sync Page)
 * 仕様書に基づき、モダンで高い保守性を持つ構造で実装。
 */
export default function SkillSyncPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SkillSync.SkillSyncContainer />
    </div>
  );
}
