/**
 * Better Auth Session Middleware for Hono
 *
 * Purpose: Honoでより Better Auth のセッション情報を受け取る
 * Flow: Cookie/ヘッダー → Better Auth セッション解析 → Hono コンテキストに注入
 */

import { Hono } from 'hono';
import type { User, Session } from 'better-auth';
import { auth } from '@/lib/auth';

/**
 * Hono コンテキストに Better Auth情報を追加
 */
declare global {
  namespace Hono {
    interface HonoRequest {
      session?: {
        user: User | null;
        session: Session | null;
      };
    }
  }
}

/**
 * Better Auth セッション取得ミドルウェア
 *
 * @description
 * - Cookie + ヘッダーから Better Auth セッション取得
 * - セッション失効の判定
 * - Hono コンテキストに session 属性追加
 */
export const betterAuthSessionMiddleware = () => {
  return async (c: any, next: any) => {
    try {
      // ブラウザから送られてきたヘッダー（Cookie含む）を取得
      const cookieHeader = c.req.header('Cookie') || '';

      // Better Auth API を使用してセッション検証
      // betterAuth.api.getSession() は内部で Cookie を解析
      const session = await auth.api.getSession({
        headers: {
          cookie: cookieHeader,
        },
      });

      // セッション情報をコンテキストに追加
      c.session = session;
      c.user = session?.user || null;

      // 次のミドルウェアへ
      await next();
    } catch (error) {
      // セッション取得エラーはスキップ（未認証状態として扱う）
      c.session = null;
      c.user = null;
      await next();
    }
  };
};

/**
 * 認証が必須のミドルウェア
 *
 * @throws 401 UNAUTHORIZED - ログインしていない場合
 */
export const requireAuth =
  () =>
  async (c: any, next: any) => {
    if (!c.session?.user) {
      return c.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
          },
        },
        401
      );
    }
    await next();
  };

/**
 * 特定のロールが必須のミドルウェア
 */
export const requireRole = (requiredRole: string) => async (c: any, next: any) => {
  if (!c.session?.user) {
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'You must be logged in',
        },
      },
      401
    );
  }

  if (c.session.user.role !== requiredRole) {
    return c.json(
      {
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `This resource requires ${requiredRole} role`,
        },
      },
      403
    );
  }

  await next();
};
