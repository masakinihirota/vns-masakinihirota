/**
 * Admin API Routes
 *
 * @description
 * - ユーザー・グループ・ネーション管理（管理者のみアクセス可能）
 * - Create, Read, Update, Delete 操作
 * - RBAC ミドルウェアで権限チェック
 * - 監査ログ記録
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { requirePlatformAdmin } from '../middleware/rbac';
import { adminRateLimit, rateLimit } from '../middleware/rate-limit';
import { errorHandler } from '../middleware/error-handler';
import {
  createUserRequestSchema,
  updateUserRequestSchema,
  listUsersQuerySchema,
  userIdParamSchema,
  UserResponse,
} from '../schemas/admin';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  PermissionDeniedError,
  isHttpError,
} from '../errors';
import * as userService from '../services/users';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types';
import type { SessionContext } from '../middleware/auth';

const admin = new Hono<{ Variables: SessionContext }>();

// Apply rate limiting to all admin routes (30 requests per minute)
admin.use('/*', adminRateLimit());

// ============================================================================
// RATE LIMIT CONFIGS
// ============================================================================

/**
 * DELETE 専用レート制限：1分間に3回のみ許可
 * 重要な削除操作はより厳しい制限が必要
 */
const deleteRateLimit = rateLimit({
  maxRequests: 3,
  windowMs: 60000,
});

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * POST /api/admin/users
 *
 * @description
 * - 新規ユーザー作成（管理者のみ）
 * - Zod バリデーション付き
 * - 監査ログ記録
 *
 * @param body CreateUserRequest (email, name, password, role)
 * @returns - 201: { success: true, data: User }
 * @throws - 400: Validation Error
 * @throws - 403: Admin role required
 * @throws - 409: Email already registered
 * @throws - 500: Internal server error
 */
admin.post(
  '/users',
  requirePlatformAdmin,
  zValidator('json', createUserRequestSchema),
  async (c) => {
    try {
      const body = c.req.valid('json');

      const user = await userService.createUser(body);

      const response: ApiSuccessResponse<UserResponse> = {
        success: true,
        data: user,
      };

      return c.json(response, 201);
    } catch (error) {
      // Use custom error types instead of message matching
      if (error instanceof UserAlreadyExistsError) {
        throw new HTTPException(409, { message: 'Email already registered' });
      }

      // Log internal errors but don't expose details to client
      console.error('[AdminAPI] User creation failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new HTTPException(500, {
        message: 'Failed to create user. Please contact support.',
      });
    }
  }
);

/**
 * GET /api/admin/users
 *
 * @description
 * - ユーザー一覧取得（管理者のみ）
 * - ページネーション・フィルター対応
 *
 * @query limit, offset, sort, order, search
 * @returns - 200: { success: true, data: { items: User[], total: number } }
 * @throws - 400: Validation Error
 * @throws - 500: Internal server error
 */
admin.get(
  '/users',
  requirePlatformAdmin,
  zValidator('query', listUsersQuerySchema),
  async (c) => {
    try {
      const { limit, offset, sort, order, search } = c.req.valid('query');

      const { items, total } = await userService.listUsers({
        limit,
        offset,
        sort,
        order,
        search,
      });

      const response: ApiSuccessResponse<{
        items: UserResponse[];
        total: number;
      }> = {
        success: true,
        data: {
          items,
          total,
        },
      };

      return c.json(response);
    } catch (error) {
      // Log internal errors but don't expose details to client
      console.error('[AdminAPI] User list fetch failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new HTTPException(500, {
        message: 'Failed to fetch users. Please contact support.',
      });
    }
  }
);

/**
 * GET /api/admin/users/:id
 *
 * @description
 * - 特定ユーザーの詳細情報を取得
 * - パスパラメータをZodで型チェック
 *
 * @param id - ユーザーID (UUID/CUID)
 * @returns - 200: { success: true, data: User }
 * @throws - 400: Invalid ID format
 * @throws - 403: Admin role required
 * @throws - 404: User not found
 * @throws - 500: Internal server error
 */
admin.get(
  '/users/:id',
  requirePlatformAdmin,
  zValidator('param', userIdParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');

      const user = await userService.getUserById(id);

      if (!user) {
        throw new UserNotFoundError(`User with ID ${id} not found`);
      }

      const response: ApiSuccessResponse<UserResponse> = {
        success: true,
        data: user,
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new HTTPException(404, { message: 'User not found' });
      }

      // Log internal errors but don't expose details to client
      console.error('[AdminAPI] User fetch failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new HTTPException(500, {
        message: 'Failed to fetch user. Please contact support.',
      });
    }
  }
);

/**
 * PATCH /api/admin/users/:id
 *
 * @description
 * - ユーザー情報を更新（管理者のみ）
 * - Zod バリデーション付き
 * - パスパラメータをZodで型チェック
 * - 権限チェック: 自分自身か、スーパー管理者のみ他者編集可能
 *
 * @param id - ユーザーID (UUID/CUID)
 * @param body UpdateUserRequest
 * @returns - 200: { success: true, data: User }
 * @throws - 400: Invalid ID format or validation error
 * @throws - 403: Admin role required or cannot edit other users
 * @throws - 404: User not found
 * @throws - 409: Email already used
 * @throws - 500: Internal server error
 */
admin.patch(
  '/users/:id',
  requirePlatformAdmin,
  zValidator('param', userIdParamSchema),
  zValidator('json', updateUserRequestSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const body = c.req.valid('json');
      const authSession = c.get('authSession');

      // ✅権限チェック: 自分以外を編集しようとしていないか、またはスーパー管理者か
      if (authSession.user.id !== id && authSession.user.role !== 'super_admin') {
        throw new PermissionDeniedError(
          'Cannot edit other users without super admin role'
        );
      }

      const user = await userService.updateUser(id, body);

      const response: ApiSuccessResponse<UserResponse> = {
        success: true,
        data: user,
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw new HTTPException(403, { message: 'Permission denied' });
      }
      if (error instanceof UserNotFoundError) {
        throw new HTTPException(404, { message: 'User not found' });
      }
      if (error instanceof UserAlreadyExistsError) {
        throw new HTTPException(409, { message: 'Email already in use' });
      }

      // Log internal errors but don't expose details to client
      console.error('[AdminAPI] User update failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new HTTPException(500, {
        message: 'Failed to update user. Please contact support.',
      });
    }
  }
);

/**
 * DELETE /api/admin/users/:id
 *
 * @description
 * - ユーザーを削除（管理者のみ）
 * - パスパラメータをZodで型チェック
 * - 権限チェック: スーパー管理者のみ削除可能（自分さえも削除不可）
 * - DELETE専用の厳しいレート制限: 1分に3回のみ
 * - 監査ログ記録（実装予定）
 *
 * @param id - ユーザーID (UUID/CUID)
 * @returns - 200: { success: true, data: { message: 'User deleted successfully' } }
 * @throws - 400: Invalid ID format
 * @throws - 403: Admin role required or super admin required for deletion
 * @throws - 404: User not found
 * @throws - 429: Too many requests (rate limited)
 * @throws - 500: Internal server error
 */
admin.delete(
  '/users/:id',
  requirePlatformAdmin,
  deleteRateLimit,  // ✅ DELETE 専用の厳しいレート制限
  zValidator('param', userIdParamSchema),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const authSession = c.get('authSession');

      // ✅権限チェック: DELETE は super_admin のみ許可（自分も削除不可）
      if (authSession.user.role !== 'super_admin') {
        throw new PermissionDeniedError(
          'Only super admin users can delete accounts'
        );
      }

      await userService.deleteUser(id);

      const response: ApiSuccessResponse<{ message: string }> = {
        success: true,
        data: { message: 'User deleted successfully' },
      };

      return c.json(response);
    } catch (error) {
      if (error instanceof PermissionDeniedError) {
        throw new HTTPException(403, { message: 'Permission denied' });
      }
      if (error instanceof UserNotFoundError) {
        throw new HTTPException(404, { message: 'User not found' });
      }

      // Log internal errors but don't expose details to client
      console.error('[AdminAPI] User deletion failed:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new HTTPException(500, {
        message: 'Failed to delete user. Please contact support.',
      });
    }
  }
);

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================

/**
 * Apply global error handler to catch all errors
 * Ensures consistent error response formatting and logging
 */
admin.onError(errorHandler);

export default admin;
