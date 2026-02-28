/**
 * Hono RPC Client
 *
 * @description
 * - サーバー側の型定義から完全な型推論を提供
 * - ゼロ設定で型安全な API クライアント
 * - VSCode での自動補完サポート
 *
 * @example
 * ```typescript
 * import { client } from '@/lib/api/client';
 *
 * // GET /api/health
 * const res = await client.health.$get();
 * const data = await res.json(); // { success: true, data: { status: 'ok', ... } }
 *
 * // GET /api/users/:id
 * const res = await client.users[':id'].$get({ param: { id: '123' } });
 * const data = await res.json(); // { success: true, data: { id: string, name: string } }
 *
 * // POST /api/users
 * const res = await client.users.$post({ json: { name: 'John' } });
 * const data = await res.json(); // { success: true, data: User }
 *
 * // Error handling
 * if (!data.success) {
 *   console.error(data.error.code, data.error.message);
 *   if (data.error.code === 'UNAUTHORIZED') {
 *     router.push('/signin');
 *   }
 * }
 * ```
 */

import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

/**
 * API Client インスタンス
 *
 * @description
 * - AppType から型を自動推論
 * - サーバー側の定義が変更されると、クライアント側の型も自動更新
 */
export const client = hc<AppType>(
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
);

/**
 * 型推論のヘルパー型
 */
export type { AppType };
