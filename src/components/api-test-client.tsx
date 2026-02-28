/**
 * API Test Client Component
 *
 * 第1段階実装例：クライアントコンポーネント
 * - 'use client' でブラウザで実行
 * - ボタンクリック → API呼び出し
 * - レスポンスをリアルタイム表示
 */

'use client';

import { useState } from 'react';
import { client } from '@/lib/api/client';

interface ApiResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
  };
}

interface LoadingState {
  health: boolean;
  poc: boolean;
}

export function ApiTestClientComponent() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    health: false,
    poc: false,
  });
  const [error, setError] = useState<string | null>(null);

  const callApi = async (endpoint: 'health' | 'poc') => {
    setLoading((prev) => ({ ...prev, [endpoint]: true }));
    setError(null);
    setResponse(null);

    try {
      let res;

      if (endpoint === 'health') {
        res = await client.api.health.$get();
      } else {
        res = await client.api['[[...route]]'].poc.$get();
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setResponse(null);
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* ボタングループ */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => callApi('health')}
          disabled={loading.health}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading.health ? (
            <>
              <span className="animate-spin">⏳</span>
              Loading...
            </>
          ) : (
            <>
              <span>🔗</span>
              GET /api/health
            </>
          )}
        </button>

        <button
          onClick={() => callApi('poc')}
          disabled={loading.poc}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading.poc ? (
            <>
              <span className="animate-spin">⏳</span>
              Loading...
            </>
          ) : (
            <>
              <span>🔗</span>
              GET /api/poc
            </>
          )}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded p-4">
          <p className="text-red-200 font-semibold">❌ エラー</p>
          <p className="text-red-100 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* レスポンス表示 */}
      {response && (
        <div className="bg-slack-900 rounded p-4 border border-slate-600">
          <p className="text-green-400 font-semibold mb-2">✅ レスポンス受信</p>
          <div className="bg-slate-950 rounded p-3 font-mono text-sm text-slate-300 overflow-x-auto">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>

          {response.success && (
            <div className="mt-3 text-sm text-slate-400">
              <p>
                ✅{' '}
                <span className="text-green-400">通信成功</span>
                - フロントエンド ↔ Hono バックエンド間で
                <span className="text-orange-300 font-semibold">型安全な通信</span>
                が成立
              </p>
            </div>
          )}
        </div>
      )}

      {/* 操作ヒント */}
      <div className="bg-slate-700 rounded p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-200 mb-2">💡 操作方法</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>上記ボタンをクリック</li>
          <li>Honoバックエンドへリクエスト送信</li>
          <li>JSONレスポンスを受け取って表示</li>
          <li>
            ブラウザ開発者ツール (F12) でNetwork タブを確認して、
            <code className="bg-slate-800 px-1 rounded">
              /api/health
            </code>
            や
            <code className="bg-slate-800 px-1 rounded">
              /api/poc
            </code>
            の通信を確認
          </li>
        </ol>
      </div>

      {/* 技術情報 */}
      <div className="bg-slate-700 rounded p-4 text-sm text-slate-300">
        <p className="font-semibold text-slate-200 mb-2">🔧 技術詳細</p>
        <ul className="space-y-1">
          <li>
            • <code className="text-orange-300">client.api.health.$get()</code> は
            <span className="text-blue-300 font-semibold"> Hono RPC Client</span>
          </li>
          <li>
            • <code className="text-orange-300">AppType</code> から
            <span className="text-blue-300 font-semibold"> 完全に型推論</span>
            される
          </li>
          <li>
            • VSCode の自動補完（Ctrl+Space）で全エンドポイント候補表示
          </li>
          <li>
            • エラーレスポンスの型も推論される（
            <code className="text-orange-300">
              error.code
            </code>
            等の候補表示）
          </li>
        </ul>
      </div>
    </div>
  );
}
