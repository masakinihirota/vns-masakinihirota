/**
 * 監査ログ検索ページ - サーバーコンポーネント
 * 初期データ取得後、AuditLogsContent（クライアントコンポーネント）で表示・検索処理
 */

import { searchAuditLogs } from '@/lib/db/admin-queries';

import { AuditLogsContent } from './components/audit-logs-content';

/**
 *
 */
export default async function AuditPage() {
    // サーバー側で初期データ取得
    const result = await searchAuditLogs('', undefined, undefined, 1);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <AuditLogsContent
                initialLogs={result.logs}
                initialTotal={result.total}
            />
        </div>
    );
}
