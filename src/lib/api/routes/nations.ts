/**
 * Nations API Routes
 *
 * @description
 * - ネーション情報取得・更新エンドポイント
 * - 認証済みユーザーによるネーション管理
 * - ネーション所有者による情報更新
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireNationRole } from '../middleware/rbac';
import { validateCsrfToken } from '../middleware/csrf';
import { rateLimit } from '../middleware/rate-limit';
import {
  getNations,
  getNationById,
  updateNation,
} from '@/lib/db/nations';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/response';
import type { SessionContext } from '../middleware/auth';

const nations = new Hono<{ Variables: SessionContext }>();

// ============================================================================
// Schemas
// ============================================================================

const nationIdParamSchema = z.object({
  id: z.string().min(1),
});

const updateNationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  transactionFeeRate: z.string().regex(/^\d+(\.\d+)?$/).optional(),
  foundationFee: z.number().min(0).optional(),
});

const listNationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// ============================================================================
// Middleware
// ============================================================================

// レート制限: 30回/分
const nationRateLimit = rateLimit({
  maxRequests: 30,
  windowMs: 60000,
});

nations.use('/*', nationRateLimit);

// CSRF保護（PATCH）
nations.use('/*', validateCsrfToken);

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/nations
 *
 * @description
 * - ネーション一覧取得
 * - 認証必須
 * - ページネーション対応
 *
 * @query limit - 取得件数（デフォルト: 20、最大: 100）
 * @returns
 * - 200: { success: true, data: Nation[] }
 * - 401: Unauthorized
 */
nations.get('/', requireAuth, zValidator('query', listNationsQuerySchema), async (c) => {
  try {
    const { limit } = c.req.valid('query');

    const nationList = await getNations(limit);

    const response: ApiSuccessResponse<typeof nationList> = {
      success: true,
      data: nationList,
    };

    return c.json(response);
  } catch (error) {
    console.error('[NationsAPI] List nations failed:', error);
    throw error;
  }
});

/**
 * GET /api/nations/:id
 *
 * @description
 * - ネーション詳細取得
 * - 認証必須
 *
 * @param id - ネーションID
 * @returns
 * - 200: { success: true, data: Nation }
 * - 404: Nation not found
 */
nations.get('/:id', requireAuth, zValidator('param', nationIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');

    const nation = await getNationById(id);

    if (!nation) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Nation not found',
          details: { nationId: id },
        },
      };
      return c.json(response, 404);
    }

    const response: ApiSuccessResponse<typeof nation> = {
      success: true,
      data: nation,
    };

    return c.json(response);
  } catch (error) {
    console.error('[NationsAPI] Get nation failed:', error);
    throw error;
  }
});

/**
 * PATCH /api/nations/:id
 *
 * @description
 * - ネーション情報更新
 * - ネーションリーダーまたはプラットフォーム管理者のみ可能
 * - CSRF保護適用
 *
 * @param id - ネーションID
 * @param body - 更新データ
 * @returns
 * - 200: { success: true, data: Nation }
 * - 400: Validation Error
 * - 403: Permission denied (leader role required)
 * - 404: Nation not found
 */
nations.patch(
  '/:id',
  requireNationRole('leader'),
  zValidator('param', nationIdParamSchema),
  zValidator('json', updateNationSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');

      // ネーション存在確認
      const exists = await getNationById(id);
      if (!exists) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Nation not found',
            details: { nationId: id },
          },
        };
        return c.json(response, 404);
      }

      const updated = await updateNation(id, data);

      const response: ApiSuccessResponse<typeof updated> = {
        success: true,
        data: updated,
      };

      return c.json(response);
    } catch (error) {
      console.error('[NationsAPI] Update nation failed:', error);
      throw error;
    }
  }
);

export default nations;
