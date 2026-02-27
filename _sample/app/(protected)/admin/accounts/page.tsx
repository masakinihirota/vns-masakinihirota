/**
 * ユーザー管理ページ - サーバーコンポーネント
 * /admin/accounts ルート
 *
 * 初期データの取得と、クライアントコンポーネントへの受け渡しを行います。
 */

import { searchUsers } from '@/lib/db/admin-queries';

import { AccountsContent } from './components/accounts-content';

/**
 * ユーザー管理ページのメインコンポーネント
 * @returns ユーザー管理画面のレンダリング結果
 */
export default async function AccountsPage() {
  // サーバー側で初期データ取得
  const result = await searchUsers('', 'all', 'all', 1);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <AccountsContent initialData={result} />
    </div>
  );
}
