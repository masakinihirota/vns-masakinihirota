/**
 * Hono API Routes for Next.js App Router
 *
 * @description
 * - Hono を Next.js App Router と統合
 * - Better Auth と並行運用（/api/auth/* は Better Auth、/api/* は Hono）
 * - RPC Client による完全な型推論をサポート
 *
 * @design
 * - Runtime: Node.js（Drizzle ORM + PostgreSQL の完全対応）
 * - Error Handler: 統一エラーフォーマット
 * - Middleware: auth, error-handler
 */

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { errorHandler } from '@/lib/api/middleware/error-handler';
import health from '@/lib/api/routes/health';
import poc from '@/lib/api/routes/poc';

// ============================================================================
// Hono App Setup
// ============================================================================

const app = new Hono().basePath('/api');

// ============================================================================
// Global Error Handler
// ============================================================================

app.onError(errorHandler);

// ============================================================================
// Routes
// ============================================================================

// Health Check
app.route('/health', health);

// PoC (Proof of Concept) - RPC Client テスト用
app.route('/poc', poc);

// Admin API (Phase 2 で実装)
// app.route('/admin', adminRouter);

// User API (Phase 3 で実装)
// app.route('/users', userRouter);

// Group API (Phase 3 で実装)
// app.route('/groups', groupRouter);

// Nation API (Phase 3 で実装)
// app.route('/nations', nationRouter);

// Notification API (Phase 4 で実装)
// app.route('/notifications', notificationRouter);

// ============================================================================
// Next.js App Router Export
// ============================================================================

/**
 * Runtime: Node.js
 *
 * @required
 * - Drizzle ORM + PostgreSQL の完全対応
 * - Edge Runtime は DB 接続に制限あり
 */
export const runtime = 'nodejs';

/**
 * HTTP Method Handlers
 *
 * @description
 * - Next.js App Router の Route Handler 形式でエクスポート
 * - hono/vercel の handle() を使用して Vercel 環境に最適化
 */
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

// ============================================================================
// RPC Client Type Export
// ============================================================================

/**
 * AppType: Hono RPC Client 用の型
 *
 * @description
 * - クライアント側で hc<AppType>('/api') として使用
 * - サーバー側の定義から自動的に型推論
 */
export type AppType = typeof app;
