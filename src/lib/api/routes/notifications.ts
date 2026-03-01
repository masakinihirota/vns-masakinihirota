/**
 * Notifications API Routes
 *
 * @description
 * - 通知情報取得・更新エンドポイント
 * - 認証済みユーザーによる通知管理
 * - 既読マーク・削除機能
 */

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validateCsrfToken } from '../middleware/csrf';
import { rateLimit } from '../middleware/rate-limit';
import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  deleteNotification,
} from '@/lib/db/notifications';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/response';
import type { SessionContext } from '../middleware/auth';

const notificationsRoute = new Hono<{ Variables: SessionContext }>();

// ============================================================================
// Schemas
// ============================================================================

const notificationIdParamSchema = z.object({
  id: z.string().min(1),
});

const listNotificationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

// ============================================================================
// Middleware
// ============================================================================

// レート制限: 30回/分
const notificationsRateLimit = rateLimit({
  maxRequests: 30,
  windowMs: 60000,
});

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/notifications
 *
 * @description
 * - 認証済みユーザーの通知一覧を取得
 * - 最新順でソート
 * - ページネーション対応
 *
 * @query
 * - limit: 取得件数（1～100、デフォルト: 20）
 * - offset: スキップ件数（デフォルト: 0）
 *
 * @returns
 * - 200: { success: true, data: Notification[] }
 * - 401: Unauthorized
 */
notificationsRoute.get(
  '/',
  requireAuth,
  notificationsRateLimit,
  zValidator('query', listNotificationsQuerySchema),
  async (c) => {
    try {
      const authSession = c.get('authSession');

      if (!authSession?.user?.id) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You are not logged in',
          },
        };
        return c.json(response, 401);
      }

      const query = c.req.valid('query');
      const notifications = await getNotifications(
        authSession.user.id,
        query.limit,
        query.offset
      );

      const response: ApiSuccessResponse<typeof notifications> = {
        success: true,
        data: notifications,
      };

      return c.json(response);
    } catch (error) {
      console.error('[NotificationsAPI] Get notifications failed:', error);
      throw error;
    }
  }
);

/**
 * PATCH /api/notifications/:id
 *
 * @description
 * - 通知を既読にマーク
 * - 本人のみ可能
 * - CSRF保護適用
 * - レート制限適用
 *
 * @param id - 通知ID
 *
 * @returns
 * - 200: { success: true, data: Notification }
 * - 401: Unauthorized
 * - 403: Permission denied
 * - 404: Notification not found
 */
notificationsRoute.patch(
  '/:id',
  requireAuth,
  validateCsrfToken,
  notificationsRateLimit,
  zValidator('param', notificationIdParamSchema),
  async (c) => {
    try {
      const authSession = c.get('authSession');

      if (!authSession?.user?.id) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You are not logged in',
          },
        };
        return c.json(response, 401);
      }

      const { id } = c.req.valid('param');

      // 通知存在確認とアクセス権確認
      const notification = await getNotificationById(id);
      if (!notification) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found',
            details: { notificationId: id },
          },
        };
        return c.json(response, 404);
      }

      if (notification.user_profile_id !== authSession.user.id) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this notification',
            details: { notificationId: id },
          },
        };
        return c.json(response, 403);
      }

      const updated = await markNotificationAsRead(id);

      const result: ApiSuccessResponse<typeof updated> = {
        success: true,
        data: updated,
      };

      return c.json(result);
    } catch (error) {
      console.error('[NotificationsAPI] Mark as read failed:', error);
      throw error;
    }
  }
);

/**
 * DELETE /api/notifications/:id
 *
 * @description
 * - 通知を削除
 * - 本人のみ可能
 * - CSRF保護適用
 * - レート制限適用
 *
 * @param id - 通知ID
 *
 * @returns
 * - 200: { success: true, data: Notification }
 * - 401: Unauthorized
 * - 403: Permission denied
 * - 404: Notification not found
 */
notificationsRoute.delete(
  '/:id',
  requireAuth,
  validateCsrfToken,
  notificationsRateLimit,
  zValidator('param', notificationIdParamSchema),
  async (c) => {
    try {
      const authSession = c.get('authSession');

      if (!authSession?.user?.id) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'You are not logged in',
          },
        };
        return c.json(response, 401);
      }

      const { id } = c.req.valid('param');

      // 通知存在確認とアクセス権確認
      const notification = await getNotificationById(id);
      if (!notification) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found',
            details: { notificationId: id },
          },
        };
        return c.json(response, 404);
      }

      if (notification.user_profile_id !== authSession.user.id) {
        const response: ApiErrorResponse = {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this notification',
            details: { notificationId: id },
          },
        };
        return c.json(response, 403);
      }

      const deleted = await deleteNotification(id);

      const result: ApiSuccessResponse<typeof deleted> = {
        success: true,
        data: deleted,
      };

      return c.json(result);
    } catch (error) {
      console.error('[NotificationsAPI] Delete notification failed:', error);
      throw error;
    }
  }
);

export default notificationsRoute;
