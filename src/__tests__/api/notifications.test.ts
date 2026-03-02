/**
 * Notifications API Integration Tests
 *
 * @description
 * - GET /api/notifications - 通知一覧取得
 * - PATCH /api/notifications/:id - 既読マーク
 * - DELETE /api/notifications/:id - 削除
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import notifications from '@/lib/api/routes/notifications';
import type { SessionContext } from '@/lib/api/middleware/auth';

// DB functions をモック
vi.mock('@/lib/db/notifications', () => ({
  getNotifications: vi.fn(),
  getNotificationById: vi.fn(),
  markNotificationAsRead: vi.fn(),
  deleteNotification: vi.fn(),
}));

vi.mock('@/lib/api/middleware/auth', () => ({
  requireAuth: vi.fn((c, next) => {
    // モックセッションを設定
    c.set('authSession', {
      user: {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
      session: {
        id: 'session-123',
        userId: 'user-123',
      },
    });
    return next();
  }),
}));

vi.mock('@/lib/api/middleware/rate-limit', () => ({
  rateLimit: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/csrf', () => ({
  validateCsrfToken: vi.fn((c: any, next: any) => next()),
}));

describe('[Integration] Notifications API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /notifications', () => {
    it('should return list of notifications with default limit', async () => {
      const { getNotifications } = await import('@/lib/db/notifications');
      const mockNotifications = [
        {
          id: 'notif-1',
          user_profile_id: 'user-123',
          title: 'Test Notification 1',
          message: 'This is a test notification',
          link_url: null,
          type: 'system',
          is_read: false,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'notif-2',
          user_profile_id: 'user-123',
          title: 'Test Notification 2',
          message: 'Another test notification',
          link_url: 'https://example.com',
          type: 'invite',
          is_read: true,
          created_at: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(getNotifications).mockResolvedValue(mockNotifications as any);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await testClient(app).notifications.$get();
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].title).toBe('Test Notification 1');
      expect(data.data[0].is_read).toBe(false);
      expect(data.data[1].is_read).toBe(true);
    });

    it('should accept limit and offset parameters', async () => {
      const { getNotifications } = await import('@/lib/db/notifications');
      vi.mocked(getNotifications).mockResolvedValue([]);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await testClient(app).notifications.$get({
        query: { limit: '50', offset: '10' },
      });
      expect(res.status).toBe(200);

      expect(getNotifications).toHaveBeenCalledWith('user-123', 50, 10);
    });

    it('should return empty array when no notifications', async () => {
      const { getNotifications } = await import('@/lib/db/notifications');
      vi.mocked(getNotifications).mockResolvedValue([]);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await testClient(app).notifications.$get();
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(0);
    });
  });

  describe('PATCH /notifications/:id', () => {
    it('should mark notification as read', async () => {
      const { getNotificationById, markNotificationAsRead } = await import(
        '@/lib/db/notifications'
      );

      const existingNotification = {
        id: 'notif-1',
        user_profile_id: 'user-123',
        title: 'Test Notification',
        message: 'This is a test',
        link_url: null,
        type: 'system',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
      };

      const updatedNotification = {
        ...existingNotification,
        is_read: true,
      };

      vi.mocked(getNotificationById).mockResolvedValue(
        existingNotification as any
      );
      vi.mocked(markNotificationAsRead).mockResolvedValue(
        updatedNotification as any
      );

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/notif-1', {
        method: 'PATCH',
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.is_read).toBe(true);
    });

    it('should return 404 when notification not found', async () => {
      const { getNotificationById } = await import('@/lib/db/notifications');
      vi.mocked(getNotificationById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/non-existent', {
        method: 'PATCH',
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should return 403 when user does not own notification', async () => {
      const { getNotificationById } = await import('@/lib/db/notifications');

      const otherUserNotification = {
        id: 'notif-1',
        user_profile_id: 'other-user-456',
        title: 'Test Notification',
        message: 'This is a test',
        link_url: null,
        type: 'system',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(getNotificationById).mockResolvedValue(
        otherUserNotification as any
      );

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/notif-1', {
        method: 'PATCH',
      });

      expect(res.status).toBe(403);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('FORBIDDEN');
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete notification', async () => {
      const { getNotificationById, deleteNotification } = await import(
        '@/lib/db/notifications'
      );

      const notification = {
        id: 'notif-1',
        user_profile_id: 'user-123',
        title: 'Test Notification',
        message: 'This is a test',
        link_url: null,
        type: 'system',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(getNotificationById).mockResolvedValue(notification as any);
      vi.mocked(deleteNotification).mockResolvedValue(notification as any);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/notif-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('notif-1');
      expect(deleteNotification).toHaveBeenCalledWith('notif-1');
    });

    it('should return 404 when notification not found', async () => {
      const { getNotificationById } = await import('@/lib/db/notifications');
      vi.mocked(getNotificationById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/non-existent', {
        method: 'DELETE',
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should return 403 when user does not own notification', async () => {
      const { getNotificationById } = await import('@/lib/db/notifications');

      const otherUserNotification = {
        id: 'notif-1',
        user_profile_id: 'other-user-456',
        title: 'Test Notification',
        message: 'This is a test',
        link_url: null,
        type: 'system',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(getNotificationById).mockResolvedValue(
        otherUserNotification as any
      );

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/notifications', notifications);

      const res = await app.request('/notifications/notif-1', {
        method: 'DELETE',
      });

      expect(res.status).toBe(403);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('FORBIDDEN');
    });
  });
});
