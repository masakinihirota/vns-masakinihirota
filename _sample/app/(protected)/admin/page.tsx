/**
 * Admin Dashboard - HOME ページ
 * 全体概要 / KPI 表示 - サーバーコンポーネント
 *
 * /admin ルート
 */

import { getDashboardKPI, searchAuditLogs } from '@/lib/db/admin-queries';

import { DashboardContent } from './components/dashboard-content';

/**
 * 管理者ダッシュボードのメインページ
 * 統計情報や直近のログを表示します。
 * @returns ダッシュボード画面のレンダリング結果
 */
export default async function AdminDashboardPage() {
  // サーバー側で初期データ取得
  const kpiData = await getDashboardKPI();
  const logsData = await searchAuditLogs('', undefined, undefined, 1);

  const initialData = {
    kpi: kpiData,
    recentLogs: logsData.logs.slice(0, 5),
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <DashboardContent initialData={initialData} />
    </div>
  );
}
