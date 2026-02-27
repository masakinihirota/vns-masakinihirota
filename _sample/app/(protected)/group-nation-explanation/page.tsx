import * as GroupNation from "@/components/group-nation";

/**
 * グループと国の説明ページ
 *
 * 仕様書に基づき、システムの根本的な概念をユーザーに提示します。
 * 副作用は持たず、コンポーネントの配置に専念する実装としています。
 */
export default function GroupNationExplanationPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] selection:bg-blue-100 dark:selection:bg-indigo-900/50">
      <GroupNation.GroupNationComparison />
    </div>
  );
}
