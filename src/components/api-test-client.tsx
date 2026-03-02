'use client';

import { useState } from 'react';
import { client } from '@/lib/api/client';

export function ApiTestClientComponent() {
    const [response, setResponse] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = async (endpoint: string) => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            let res;
            switch (endpoint) {
                case 'health':
                    // ✅ Phase 6: RPC Client 完全統合
                    // 型安全: client.health.get() の返り値は型定義スキーマで保証
                    res = await client.health.get();
                    break;
                case 'poc/hello':
                    // ✅ Phase 6: RPC Client 完全統合
                    // 型安全: client.poc.hello.get() の返り値は型定義スキーマで保証
                    res = await client.poc.hello.get();
                    break;
                default:
                    throw new Error(`Unknown endpoint: ${endpoint}`);
            }

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => callApi('health')}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-500"
                >
                    {loading ? '⏳' : '🔗'} GET /api/health
                </button>
                <button
                    onClick={() => callApi('poc/hello')}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:bg-gray-500"
                >
                    {loading ? '⏳' : '🔗'} GET /api/poc/hello
                </button>
            </div>

            {error && (
                <div className="bg-red-900 border border-red-700 rounded p-3 text-red-100">
                    ❌ {error}
                </div>
            )}

            {response !== null && (
                <div className="bg-slate-900 rounded p-3 border border-slate-700">
                    <p className="text-green-400 font-semibold mb-2">✅ レスポンス受信</p>
                    <pre className="text-slate-300 text-sm overflow-x-auto">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}

            <div className="bg-slate-700 rounded p-3 text-sm text-slate-300">
                <p className="font-semibold text-slate-200 mb-2">💡 操作方法</p>
                <ol className="list-decimal list-inside space-y-1">
                    <li>上記のボタンをクリック</li>
                    <li>Honoバックエンドへリクエスト送信</li>
                    <li>JSONレスポンスを受け取って表示</li>
                    <li>F12開発者ツール → NetworkタブでAPI通信を確認</li>
                </ol>
            </div>
        </div>
    );
}
