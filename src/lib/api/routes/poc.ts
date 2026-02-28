/**
 * PoC (Proof of Concept) Endpoint
 *
 * @description
 * - RPC Client の型推論テスト用エンドポイント
 * - パラメータ型推論、エラーハンドリングの確認
 */

import { Hono } from 'hono';
import { requireAuth } from '../middleware';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/response';
import { createApiError } from '../middleware/error-handler';

const poc = new Hono();

// ============================================================================
// 基本的な型推論確認
// ============================================================================

/**
 * GET /api/poc/hello
 *
 * @description
 * - 基本的な型推論を確認
 * - 認証不要
 */
poc.get('/hello', (c) => {
  const response: ApiSuccessResponse<{ message: string }> = {
    success: true,
    data: { message: 'Hello from Hono API!' },
  };
  return c.json(response);
});

// ============================================================================
// パラメータ型推論確認
// ============================================================================

/**
 * GET /api/poc/users/:id
 *
 * @description
 * - パラメータ型推論を確認
 * - 認証不要
 */
poc.get('/users/:id', (c) => {
  const id = c.req.param('id');
  const response: ApiSuccessResponse<{ id: string; name: string }> = {
    success: true,
    data: {
      id,
      name: `User ${id}`,
    },
  };
  return c.json(response);
});

/**
 * GET /api/poc/search?q=keyword
 *
 * @description
 * - クエリパラメータ型推論を確認
 * - 認証不要
 */
poc.get('/search', (c) => {
  const query = c.req.query('q') || '';
  const page = parseInt(c.req.query('page') || '1', 10);

  const response: ApiSuccessResponse<{
    query: string;
    page: number;
    results: string[];
  }> = {
    success: true,
    data: {
      query,
      page,
      results: [`Result 1 for "${query}"`, `Result 2 for "${query}"`],
    },
  };
  return c.json(response);
});

// ============================================================================
// エラーハンドリング確認
// ============================================================================

/**
 * GET /api/poc/error/404
 *
 * @description
 * - 404 エラーのテスト
 * - 認証不要
 */
poc.get('/error/404', (c) => {
  throw createApiError('NOT_FOUND', 'Resource not found');
});

/**
 * GET /api/poc/error/500
 *
 * @description
 * - 500 エラーのテスト
 * - 認証不要
 */
poc.get('/error/500', (c) => {
  throw createApiError('INTERNAL_ERROR', 'Internal server error');
});

/**
 * GET /api/poc/error/validation
 *
 * @description
 * - バリデーションエラーのテスト
 * - 認証不要
 */
poc.get('/error/validation', (c) => {
  throw createApiError('VALIDATION_ERROR', 'Invalid request data', {
    field: 'email',
    issue: 'Invalid email format',
  });
});

// ============================================================================
// 認証確認
// ============================================================================

/**
 * GET /api/poc/protected
 *
 * @description
 * - 認証必須エンドポイント
 * - requireAuth middleware のテスト
 */
poc.get('/protected', requireAuth, (c) => {
  const authSession = c.get('authSession');

  const response: ApiSuccessResponse<{
    message: string;
    userId: string;
    userRole: string;
  }> = {
    success: true,
    data: {
      message: 'You are authenticated!',
      userId: authSession.user.id,
      userRole: authSession.user.role || 'user',
    },
  };
  return c.json(response);
});

// ============================================================================
// POST エンドポイント確認
// ============================================================================

/**
 * POST /api/poc/echo
 *
 * @description
 * - POST リクエストの型推論を確認
 * - 認証不要
 */
poc.post('/echo', async (c) => {
  const body = await c.req.json();

  const response: ApiSuccessResponse<{
    received: any;
    timestamp: number;
  }> = {
    success: true,
    data: {
      received: body,
      timestamp: Date.now(),
    },
  };
  return c.json(response);
});

export default poc;
