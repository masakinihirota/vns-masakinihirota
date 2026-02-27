/**
 * ペナルティ管理ページ - サーバーコンポーネント
 */

import { getPenalties } from '@/lib/db/admin-queries';

import { PenaltiesContent } from './components/penalties-content';

/**
 *
 */
export default async function PenaltiesPage() {
    // サーバー側で初期データ取得
    const result = await getPenalties(1, 100);

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <PenaltiesContent initialPenalties={result.penalties} />
        </div>
    );
}
