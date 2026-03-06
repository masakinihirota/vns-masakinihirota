/**
 * Authentication Middleware
 *
 * @description
 * - Better Auth のセッション検証を Hono で再利用
 * - セッション情報を Context に保存して後続の middleware/handler で使用可能に
 *
 * @design
 * - Better Auth の `auth.api.getSession()` を呼び出してセッション取得
 * - セッションが存在しない場合は 401 Unauthorized で拒否
 * - セッションが存在する場合は userId, userRole を Context に設定
 */

import { auth } from '@/lib/auth';
import type { AuthSession } from '@/lib/auth/types';
import { logger } from '@/lib/logger';
import type { MiddlewareHandler } from 'hono';
import { createApiError } from './error-handler';

/**
 * Hono Context に保存するセッション情報の型
 * AuthSession と同じ形式で保存
 */
export type SessionContext = {
  authSession: AuthSession;
};

/**
 * 認証必須 middleware
 *
 * @description
 * - リクエストヘッダーから Better Auth のセッションを取得
 * - セッションが存在しない場合は 401 Unauthorized
 * - セッションが存在する場合は AuthSession を Context に設定
 *
 * @example
 * app.use('/api/*', requireAuth);
 */
export const requireAuth: MiddlewareHandler<{
  Variables: SessionContext;
}> = async (c, next) => {
  try {
    // Better Auth のセッション取得
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user || !session?.session) {
      throw createApiError('UNAUTHORIZED', 'Authentication required');
    }

    // AuthSession オブジェクトを構築
    const authSession: AuthSession = {
      user: {
        id: session.user.id,
        email: session.user.email ?? null,
        name: session.user.name ?? null,
        role: session.user.role ?? null,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    };

    // Context にセッション情報を保存
    c.set('authSession', authSession);

    await next();
  } catch (error) {
    // エラーハンドラーに投げる
    throw error;
  }
};

/**
 * 認証オプション middleware（認証があれば Context に設定、なければスルー）
 *
 * @description
 * - セッションが存在する場合は Context に設定
 * - セッションが存在しない場合はそのまま次の middleware へ
 * - Public エンドポイントで「ログイン状態に応じて情報を変える」場合に使用
 *
 * @example
 * app.use('/api/public/*', optionalAuth);
 */
export const optionalAuth: MiddlewareHandler<{
  Variables: Partial<SessionContext>;
}> = async (c, next) => {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (session?.user && session?.session) {
      // AuthSession オブジェクトを構築
      const authSession: AuthSession = {
        user: {
          id: session.user.id,
          email: session.user.email ?? null,
          name: session.user.name ?? null,
          role: session.user.role ?? null,
        },
        session: {
          id: session.session.id,
          expiresAt: session.session.expiresAt,
        },
      };

      c.set('authSession', authSession);
    }

    await next();
  } catch (error) {
    // セッション取得エラーは無視してそのまま次へ
    logger.warn('[optionalAuth] Session retrieval failed:', { error: String(error) });
    await next();
  }
};
