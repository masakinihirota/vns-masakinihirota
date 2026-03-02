/**
 * Groups API Routes
 *
 * @description
 * - グループ情報取得・更新エンドポイント
 * - 認証済みユーザーによるグループ管理
 * - グループメンバーによる情報更新
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { requireGroupRole } from '../middleware/rbac';
import { validateCsrfToken } from '../middleware/csrf';
import { rateLimit } from '../middleware/rate-limit';
import {
  getGroups,
  getGroupById,
  updateGroup,
  getGroupMembers,
} from '@/lib/db/groups';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/response';
import type { SessionContext } from '../middleware/auth';

const groups = new Hono<{ Variables: SessionContext }>();

// ============================================================================
// Schemas
// ============================================================================

const groupIdParamSchema = z.object({
  id: z.string().min(1),
});

const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  cover_url: z.string().url().optional().nullable(),
});

const listGroupsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// ============================================================================
// Middleware
// ============================================================================

// レート制限: 30回/分
const groupRateLimit = rateLimit({
  maxRequests: 30,
  windowMs: 60000,
});

groups.use('/*', groupRateLimit);

// CSRF保護（PATCH）
groups.use('/*', validateCsrfToken);

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/groups
 *
 * @description
 * - グループ一覧取得
 * - 認証必須
 * - ページネーション対応
 *
 * @query limit - 取得件数（デフォルト: 20、最大: 100）
 * @returns
 * - 200: { success: true, data: Group[] }
 * - 401: Unauthorized
 */
groups.get('/', requireAuth, zValidator('query', listGroupsQuerySchema), async (c) => {
  try {
    const { limit } = c.req.valid('query');

    const groupList = await getGroups(limit);

    const response: ApiSuccessResponse<typeof groupList> = {
      success: true,
      data: groupList,
    };

    return c.json(response);
  } catch (error) {
    console.error('[GroupsAPI] List groups failed:', error);
    throw error;
  }
});

/**
 * GET /api/groups/:id
 *
 * @description
 * - グループ詳細取得
 * - 認証必須
 *
 * @param id - グループID
 * @returns
 * - 200: { success: true, data: Group }
 * - 404: Group not found
 */
groups.get('/:id', requireAuth, zValidator('param', groupIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');

    const group = await getGroupById(id);

    if (!group) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Group not found',
          details: { groupId: id },
        },
      };
      return c.json(response, 404);
    }

    const response: ApiSuccessResponse<typeof group> = {
      success: true,
      data: group,
    };

    return c.json(response);
  } catch (error) {
    console.error('[GroupsAPI] Get group failed:', error);
    throw error;
  }
});

/**
 * PATCH /api/groups/:id
 *
 * @description
 * - グループ情報更新
 * - グループリーダーまたはプラットフォーム管理者のみ可能
 * - CSRF保護適用
 *
 * @param id - グループID
 * @param body - 更新データ
 * @returns
 * - 200: { success: true, data: Group }
 * - 400: Validation Error
 * - 403: Permission denied (leader role required)
 * - 404: Group not found
 */
groups.patch(
  '/:id',
  requireGroupRole('leader'),
  zValidator('param', groupIdParamSchema),
  zValidator('json', updateGroupSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');

      // グループ存在確認
      const exists = await getGroupById(id);
      if (!exists) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Group not found',
            details: { groupId: id },
          },
        };
        return c.json(response, 404);
      }

      const updated = await updateGroup(id, data);

      const response: ApiSuccessResponse<typeof updated> = {
        success: true,
        data: updated,
      };

      return c.json(response);
    } catch (error) {
      console.error('[GroupsAPI] Update group failed:', error);
      throw error;
    }
  }
);

/**
 * GET /api/groups/:id/members
 *
 * @description
 * - グループメンバー一覧取得
 * - 認証必須
 *
 * @param id - グループID
 * @returns
 * - 200: { success: true, data: GroupMember[] }
 * - 404: Group not found
 */
groups.get('/:id/members', requireAuth, zValidator('param', groupIdParamSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');

    // グループ存在確認
    const exists = await getGroupById(id);
    if (!exists) {
      const response: ApiErrorResponse = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Group not found',
          details: { groupId: id },
        },
      };
      return c.json(response, 404);
    }

    const members = await getGroupMembers(id);

    const response: ApiSuccessResponse<typeof members> = {
      success: true,
      data: members,
    };

    return c.json(response);
  } catch (error) {
    console.error('[GroupsAPI] Get members failed:', error);
    throw error;
  }
});

export default groups;
