/**
 * Users API Routes
 *
 * @description
 * - ユーザー情報取得・更新エンドポイント
 * - 認証済みユーザーによる自己情報管理
 * - プロフィール更新機能
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireSelfOrAdmin } from '../middleware/rbac';
import { validateCsrfToken } from '../middleware/csrf';
import { rateLimit } from '../middleware/rate-limit';
import { updateUserProfile } from '@/lib/db/user-profiles';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/response';
import type { SessionContext } from '../middleware/auth';

const users = new Hono<{ Variables: SessionContext }>();

// ============================================================================
// Schemas
// ============================================================================

const updateUserProfileSchema = z.object({
  display_name: z.string().min(1).max(100).optional(),
  avatar_url: z.string().url().optional(),
  purpose: z.string().max(500).optional(),
  purposes: z.array(z.string()).optional(),
  role_type: z.string().optional(),
  profile_type: z.string().optional(),
  external_links: z.record(z.string(), z.string()).optional(),
});

const userIdParamSchema = z.object({
  id: z.string().min(1),
});

// ============================================================================
// Middleware
// ============================================================================

// レート制限: 10回/分
const userRateLimit = rateLimit({
  maxRequests: 10,
  windowMs: 60000,
});

users.use('/*', userRateLimit);

// CSRF保護（PATCH/DELETE）
users.use('/*', validateCsrfToken);

// ============================================================================
// Routes
// ============================================================================

// ============================================================================
// Routes
// ============================================================================

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
users.get('/me', requireAuth, async (c) => {
  try {
    const authSession = c.get('authSession');

    if (!authSession?.user) {
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
      email: string | null;
      name: string | null;
      role: string | null | undefined;
    }> = {
      success: true,
      data: {
        id: authSession.user.id,
        email: authSession.user.email,
        name: authSession.user.name,
        role: authSession.user.role,
      },
    };

    return c.json(response);
  } catch (error) {
    throw error;
  }
});

/**
 * PATCH /api/users/:id
 *
 * @description
 * - ユーザープロフィール更新
 * - 自分自身またはプラットフォーム管理者のみ可能
 * - CSRF保護適用
 *
 * @param id - ユーザーID
 * @param body - 更新データ
 * @returns
 * - 200: { success: true, data: UserProfile }
 * - 400: Validation Error
 * - 403: Permission denied
 * - 404: User not found
 */
users.patch(
  '/:id',
  requireSelfOrAdmin(),
  zValidator('param', userIdParamSchema),
  zValidator('json', updateUserProfileSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');

      const updated = await updateUserProfile(id, data);

      if (!updated) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User profile not found',
            details: { userId: id },
          },
        };
        return c.json(response, 404);
      }

      const response: ApiSuccessResponse<typeof updated> = {
        success: true,
        data: updated,
      };

      return c.json(response);
    } catch (error) {
      console.error('[UsersAPI] Profile update failed:', error);
      throw error;
    }
  }
);

export default users;
