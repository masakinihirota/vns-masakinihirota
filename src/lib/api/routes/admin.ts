/**
 * Admin API Routes
 *
 * @description
 * - ユーザー・グループ・ネーション管理（管理者のみアクセス可能）
 * - Create, Read, Update, Delete 操作
 * - RBAC ミドルウェアで権限チェック
 */

import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { requirePlatformAdmin } from '../middleware/rbac';
import { zodValidator } from '../middleware/zod-validator';
import {
  createUserRequestSchema,
  updateUserRequestSchema,
  listUsersQuerySchema,
} from '../schemas/admin';
import * as userService from '../services/users';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types';

const admin = new Hono();

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * POST /api/admin/users
 *
 * @description
 * - 新規ユーザー作成（管理者のみ）
 * - Zod バリデーション付き
 *
 * @param body CreateUserRequest (email, name, password, role)
 * @returns - 201: { success: true, data: User }
 * @throws - 400: Validation Error
 * @throws - 403: Admin role required
 * @throws - 409: Email already registered
 */
admin.post(
  '/users',
  requirePlatformAdmin,
  zodValidator('json', createUserRequestSchema),
  async (c: any) => {
    try {
      const body = c.req.valid('json');

      const user = await userService.createUser(body);

      const response: ApiSuccessResponse<any> = {
        success: true,
        data: user,
      };

      return c.json(response, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      
      if (message.includes('Email already')) {
        throw new HTTPException(409, { message: 'Email already registered' });
      }
      
      throw new HTTPException(500, { message });
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
 */
admin.get(
  '/users',
  requirePlatformAdmin,
  zodValidator('query', listUsersQuerySchema),
  async (c: any) => {
    try {
      const query = c.req.valid('query');

      const { items, total } = await userService.listUsers({
        limit: query.limit,
        offset: query.offset,
        sort: query.sort,
        order: query.order,
        search: query.search,
      });

      const response: ApiSuccessResponse<any> = {
        success: true,
        data: {
          items,
          total,
          limit: query.limit,
          offset: query.offset,
        },
      };

      return c.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      throw new HTTPException(500, { message });
    }
  }
);

/**
 * GET /api/admin/users/:id
 *
 * @description
 * - 特定ユーザーの詳細情報を取得
 *
 * @param id - ユーザーID
 * @returns - 200: { success: true, data: User }
 * @throws - 404: User not found
 */
admin.get('/users/:id', requirePlatformAdmin, async (c: any) => {
  try {
    const id = c.req.param('id');

    const user = await userService.getUserById(id);
    
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    const response: ApiSuccessResponse<any> = {
      success: true,
      data: user,
    };

    return c.json(response);
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    throw new HTTPException(500, { message });
  }
});

/**
 * PATCH /api/admin/users/:id
 *
 * @description
 * - ユーザー情報を更新（管理者のみ）
 * - Zod バリデーション付き
 *
 * @param id - ユーザーID
 * @param body UpdateUserRequest
 * @returns - 200: { success: true, data: User }
 * @throws - 404: User not found
 */
admin.patch(
  '/users/:id',
  requirePlatformAdmin,
  zodValidator('json', updateUserRequestSchema),
  async (c: any) => {
    try {
      const id = c.req.param('id');
      const body = c.req.valid('json');

      const user = await userService.updateUser(id, body);

      const response: ApiSuccessResponse<any> = {
        success: true,
        data: user,
      };

      return c.json(response);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      
      if (message.includes('not found')) {
        throw new HTTPException(404, { message });
      }
      if (message.includes('already')) {
        throw new HTTPException(409, { message });
      }
      
      throw new HTTPException(500, { message });
    }
  }
);

/**
 * DELETE /api/admin/users/:id
 *
 * @description
 * - ユーザーを削除（管理者のみ）
 *
 * @param id - ユーザーID
 * @returns - 200: { success: true, data: { message: 'User deleted' } }
 * @throws - 404: User not found
 */
admin.delete('/users/:id', requirePlatformAdmin, async (c: any) => {
  try {
    const id = c.req.param('id');

    await userService.deleteUser(id);

    const response: ApiSuccessResponse<any> = {
      success: true,
      data: { message: 'User deleted successfully' },
    };

    return c.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    
    if (message.includes('not found')) {
      throw new HTTPException(404, { message });
    }
    
    throw new HTTPException(500, { message });
  }
});

export default admin;
