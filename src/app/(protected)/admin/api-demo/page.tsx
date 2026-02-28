/**
 * API Demo - サーバーコンポーネント
 *
 * 第1段階実装例：Honoバックエンドとの通信確認
 * - クライアントコンポーネント経由でRPC Client使用
 * - 型推論の動作確認
 * - エンドツーエンドのレスポンス取得
 */

import { ApiTestClientComponent } from '@/components/api-test-client';

export default async function ApiDemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="max-w-2xl mx-auto">
                {/* ヘッダー */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🚀 API Demo - Hono × Next.js
                    </h1>
                    <p className="text-slate-400">
                        第1段階：バックエンド通信の土台確認
                    </p>
                </div>

                {/* クライアントサイド実行 */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="mr-2">💻</span>
                        クライアントサイド実行
                    </h2>

                    <ApiTestClientComponent />

                    <div className="mt-4 text-sm text-slate-400">
                        <p>
                            ✅ ボタン操作により
                            <span className="text-blue-400">クライアントコンポーネント</span>から
                            APIを呼び出し
                        </p>
                        <p className="mt-1">
                            ✅ JSON レスポンスを画面に表示
                        </p>
                    </div>
                </div>

                {/* チェックリスト */}
                <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        📋 第1段階 チェックリスト
                    </h2>
                    <ul className="space-y-2 text-slate-300">
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            クライアントコンポーネントで RPC Client 動作
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            ブラウザで `/api/health` 動作確認
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-400 mr-2">✓</span>
                            RPC Client の型補完が有効
                        </li>
                        <li className="flex items-center">
                            <span className="text-yellow-400 mr-2">→</span>
                            次: 第2段階 認証（Better Auth セッション取得）
                        </li>
                    </ul>
                </div>

                {/* 技術情報 */}
                <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        🔧 技術詳細
                    </h2>
                    <div className="space-y-3 text-sm text-slate-300">
                        <p>
                            <span className="text-blue-300 font-semibold">📍 実装場所:</span>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>
                                <code className="bg-slate-700 px-2 py-1 rounded">src/lib/api/client.ts</code>
                                - RPC Client 定義
                            </li>
                            <li>
                                <code className="bg-slate-700 px-2 py-1 rounded">src/components/api-test-client.tsx</code>
                                - クライアント実装例
                            </li>
                            <li>
                                <code className="bg-slate-700 px-2 py-1 rounded">src/lib/api/routes/health.ts</code>
                                - バックエンド（/api/health）
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
