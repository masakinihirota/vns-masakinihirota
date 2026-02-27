import type { NextPage } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/config/routes';

/**
 * 管理者ページ
 *
 * @description
 * - 管理者ユーザーのみアクセス可能
 * - ユーザー管理、システム設定などを実装予定
 *
 * @security
 * proxy.ts で role === 'admin' チェック済み
 */
const AdminPage: NextPage = async () => {
    // セッション情報を取得
    const session = await auth.api.getSession({ headers: await headers() });

    // 権限チェック（proxy.tsで実施済みだが、念のため）
    if (!session?.user || session.user.role !== 'admin') {
        redirect(ROUTES.LANDING);
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
            {/* ヘッダー */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            🔐 管理者ページ
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {session.user.name || session.user.email}
                            </span>
                            <Link
                                href={ROUTES.HOME}
                                className="text-sm text-blue-600 hover:text-blue-700 underline"
                            >
                                ホームに戻る
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ユーザー管理 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                👥 ユーザー管理
                            </h2>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">👥</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            登録ユーザーの管理、権限変更、アカウント削除など
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            管理画面を開く →
                        </Link>
                    </div>

                    {/* システム設定 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                ⚙️ システム設定
                            </h2>
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">⚙️</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            OAuth設定、レート制限、通知設定など
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            設定画面を開く →
                        </Link>
                    </div>

                    {/* ログ・監査 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                📋 ログ・監査
                            </h2>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📋</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            ユーザーアクティビティ、エラーログ、セキュリティイベント
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            ログを表示 →
                        </Link>
                    </div>

                    {/* セッション管理 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                🔑 セッション管理
                            </h2>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🔑</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            アクティブセッション、トークン無効化、セッションタイムアウト設定
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            セッション管理 →
                        </Link>
                    </div>

                    {/* OAuth設定 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                🔐 OAuth設定
                            </h2>
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">🔐</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Google、GitHub、その他OAuth プロバイダーの設定・管理
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            OAuth設定 →
                        </Link>
                    </div>

                    {/* 統計情報 */}
                    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                📊 統計情報
                            </h2>
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">📊</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            ユーザー数、ログイン数、エラー率などの統計データ
                        </p>
                        <Link
                            href="#"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            統計を表示 →
                        </Link>
                    </div>
                </div>

                {/* 重要な通知 */}
                <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                        <div className="shrink-0">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-yellow-800">
                                管理者専用ページ
                            </h3>
                            <p className="mt-2 text-sm text-yellow-700">
                                このページは管理者のみアクセス可能です。
                                すべてのアクション は監査ログに記録されます。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
