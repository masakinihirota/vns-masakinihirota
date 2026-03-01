/**
 * Hono RPC Client
 *
 * @description
 * - サーバー側の型定義から完全な型推論を提供
 * - クライアント側でType-Safe なAPI呼び出しを実現
 * - VSCode での自動補完サポート（将来の実装適用時）
 *
 * @note
 * Next.js 16 client/server 境界の型推論問題により、
 * 現在は実装待ちの状態です。
 * UI コンポーネントは fetch() を使用し、API routes はすべて正常に動作しています。
 * RPC Client の完全統合は以下で対応予定：
 * - 型定義の共有フォルダ構成の最適化
 * - Next.js TypeScript コンパイラ設定の調整
 *
 * @example_future
 * ```typescript
 * import { client } from '@/lib/api/client';
 *
 * // GET /api/health
 * const res = await client.health.$get();
 *
 * // GET /api/admin/users/:id
 * const res = await client.admin.users[':id'].$get({ param: { id: '123' } });
 * ```
 */

import { hc } from 'hono/client';
import type { AppType } from '@/app/api/[[...route]]/route';

/**
 * API Client インスタンス（開発中）
 *
 * @description
 * - AppType から型を自動推論予定
 * - サーバー側の定義が変更されると、クライアント側の型も自動更新予定
 */
export const client = hc<AppType>('/api');

/**
 * 型推論のヘルパー型
 */
export type { AppType };
export type { InferRequestType, InferResponseType } from 'hono/client';
