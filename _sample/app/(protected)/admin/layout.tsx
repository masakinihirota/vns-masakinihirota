/**
 * Admin Layout
 * 管理画面共通レイアウト
 *
 * サイドバーのナビゲーションや権限チェックの基盤を提供します。
 */

import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { auth } from '@/lib/auth';

/**
 * 管理画面のレイアウトコンポーネント
 * @param props - コンポーネントのプロパティ
 * @param props.children - 子要素
 * @returns レイアウトのレンダリング結果
 */
async function AdminLayout({ children }: { readonly children: ReactNode }) {
  // 開発環境では権限チェックを外す
  const isDevelopment = process.env.NODE_ENV === 'development';

  let session = null;

  if (isDevelopment) {
    // 開発環境でもセッション情報は表示用に取得（権限チェック無し）
    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch {
      // セッションがない場合はnull のままOK
    }
  } else {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'mediator')) {
      redirect('/');
    }
  }

  const navItems = [
    { href: '/admin', label: '📊 Dashboard', icon: '📊' },
    { href: '/admin/accounts', label: '👥 ユーザー管理', icon: '👥' },
    { href: '/admin/penalties', label: '⚠️ ペナルティ', icon: '⚠️' },
    { href: '/admin/approvals', label: '✓ 作品承認', icon: '✓' },
    { href: '/admin/audit', label: '🔍 監査ログ', icon: '🔍' },
  ] as const;

  return (
    <div className="min-h-screen flex">
      {/* サイドバー */}
      <aside className="w-64 bg-card border-r border-border sticky top-0 hidden md:block overflow-y-auto max-h-screen">
        <div className="p-6">
          <Link href="/admin" className="text-xl font-bold block">
            🛡️ VNS Admin
          </Link>
          <p className="text-xs text-muted-foreground mt-2">v1.0</p>
        </div>

        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-8 border-t border-border text-xs text-muted-foreground">
          {session ? (
            <>
              <p>ユーザー: {session.user.name}</p>
              <p>ロール: {session.user.role}</p>
            </>
          ) : (
            <p>セッション情報なし</p>
          )}
        </div>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 bg-background overflow-auto">
        {/* モバイル用ナビゲーション */}
        <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold">
            🛡️ Admin
          </Link>
          <div className="text-xs text-muted-foreground">
            {session?.user.name || 'Guest'}
          </div>
        </div>

        {/* コンテンツ */}
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
