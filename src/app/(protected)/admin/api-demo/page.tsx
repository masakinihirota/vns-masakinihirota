/**
 * API Demo Page
 *
 * @description
 * - Hono RPC + TanStack Query の実装例を表示
 * - GET, POST リクエストのデモ
 * - キャッシュ管理のデモ
 */

import { HealthCheckDemo, UserInfoDemo } from '@/components/examples/api-demo';
import { EchoTestDemo, QueryInvalidationDemo } from '@/components/examples/mutation-demo';

export default function ApiDemoPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Hono RPC + TanStack Query Demo</h1>
        <p className="text-muted-foreground">
          Honoを使った型安全なAPIクライアントとTanStack Queryによるデータフェッチングのデモ
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Query Examples */}
        <HealthCheckDemo />
        <UserInfoDemo />

        {/* Mutation Examples */}
        <EchoTestDemo />
        <QueryInvalidationDemo />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">実装パターン</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">🔍 Query (GET)</h3>
            <pre className="rounded bg-muted p-4 overflow-x-auto">
              <code>{`const { data, isLoading, error } = useApiQuery(
  ['users', 'me'],
  async () => {
    const res = await client.users.me.$get();
    return handleApiResponse(res);
  }
);`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">✏️ Mutation (POST/PUT/DELETE)</h3>
            <pre className="rounded bg-muted p-4 overflow-x-auto">
              <code>{`const createUser = useApiMutation(
  async (input: CreateUserInput) => {
    const res = await client.admin.users.$post({ json: input });
    return handleApiResponse(res);
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  }
);

createUser.mutate({ name: 'John' });`}</code>
            </pre>
          </div>

          <div>
            <h3 className="font-medium mb-2">🎯 特徴</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>完全な型安全性（サーバー側の型定義から自動推論）</li>
              <li>自動的なキャッシング・リトライ・エラーハンドリング</li>
              <li>楽観的更新（Optimistic Update）サポート</li>
              <li>DevToolsによるデバッグ（開発環境）</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
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
