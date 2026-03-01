/**
 * Users API Routes
 *
 * @description
 * - ユーザー情報取得エンドポイント
 * - 認証情報の取得・管理
 */

import { Hono } from 'hono';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/response';

const users = new Hono();

/**
 * GET /api/users/me
 *
 * @description
 * - 現在のログインユーザー情報を返す
 * - 認証が必須
 * - セッション切れは 401 を返す
 *
 * @returns
 * - 200: { success: true, data: { id, email, name, role } }
 * - 401: { success: false, error: { code: 'UNAUTHORIZED' } }
 */
users.get('/me', (c: any) => {
  // betterAuthSessionMiddleware で session が注入されている
  const session = c.session;

  if (!session?.user) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'You are not logged in',
      },
    };
    return c.json(response, 401);
  }

  const response: ApiSuccessResponse<{
    id: string;
    email: string;
    name: string;
    role: string;
  }> = {
    success: true,
    data: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
    },
  };

  return c.json(response);
});

export default users;
