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
import { betterAuthSessionMiddleware } from '@/lib/api/middleware/auth-session';
import health from '@/lib/api/routes/health';
import users from '@/lib/api/routes/users';
import groups from '@/lib/api/routes/groups';
import nations from '@/lib/api/routes/nations';
import notifications from '@/lib/api/routes/notifications';
import admin from '@/lib/api/routes/admin';
import poc from '@/lib/api/routes/poc';

// ============================================================================
// Hono App Setup
// ============================================================================

const app = new Hono().basePath('/api');

// Type helper to ensure proper type inference
type AppInstance = typeof app;

// ============================================================================
// Global Error Handler
// ============================================================================

app.onError(errorHandler);

// ============================================================================
// Global Middleware
// ============================================================================

// Better Auth セッション取得ミドルウェア - すべてのルートで実行
app.use('*', betterAuthSessionMiddleware());

// ============================================================================
// Routes
// ============================================================================

// Health Check
app.route('/health', health);

// Users
app.route('/users', users);

// Groups
app.route('/groups', groups);

// Nations
app.route('/nations', nations);

// Notifications
app.route('/notifications', notifications);

// Admin (User/Group/Nation Management)
app.route('/admin', admin);

// PoC (Proof of Concept) - RPC Client テスト用
app.route('/poc', poc);


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
