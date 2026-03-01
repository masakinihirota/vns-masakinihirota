/**
 * Health Check Endpoint
 *
 * @description
 * - API の稼働状態を確認するためのエンドポイント
 * - RPC Client PoC のテストに使用
 */

import { Hono } from 'hono';
import type { ApiSuccessResponse } from '../types/response';

const health = new Hono();

/**
 * GET /api/health
 *
 * @description
 * - API の稼働状態を確認
 * - 認証不要
 *
 * @returns
 * - 200: { success: true, data: { status: 'ok', timestamp: number } }
 */
health.get('/', (c) => {
  const response: ApiSuccessResponse<{
    status: string;
    timestamp: number;
    version: string;
  }> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: Date.now(),
      version: '1.0.0',
    },
  };
  return c.json(response);
});

export default health;
