import * as SkillComparison from '@/components/skill-comparison';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'スキル比較 マンダラチャート | VNS Protocol',
  description: 'ユーザーとターゲットのスキルマスタリーをマンダラチャートで可視化・比較します。',
};

/**
 * スキル比較ページ
 *
 * 仕様書に基づき、MandalaContainer を中心とした構造を組み立てます。
 * 副作用は Container 側で完結しているため、サーバーコンポーネントとして実装可能です。
 */
export default function SkillComparisonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SkillComparison.MandalaContainer />
    </div>
  );
}
