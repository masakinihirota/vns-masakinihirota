/**
 * 作品承認キューページ - サーバーコンポーネント
 * 初期データ取得後、ApprovalsContent（クライアントコンポーネント）で表示・ページネーション処理
 */

import { getApprovalQueue } from '@/lib/db/admin-queries';

import { ApprovalsContent } from './components/approvals-content';

/**
 *
 */
export default async function ApprovalsPage() {
    // サーバー側で初期データ取得（ページネーション初期値１ページ目、50件）
    const { approvals, total } = await getApprovalQueue(1, 50);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <ApprovalsContent
                initialData={approvals}
                initialTotal={total}
            />
        </div>
    );
}
