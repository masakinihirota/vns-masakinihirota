/**
 * Users API Integration Tests
 *
 * @description
 * - GET /api/users/me - 認証済みユーザー情報取得
 * - PATCH /api/users/:id - ユーザープロフィール更新（本人または管理者のみ）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import users from '@/lib/api/routes/users';
import type { SessionContext } from '@/lib/api/middleware/auth';

// DB functions をモック
vi.mock('@/lib/db/user-profiles', () => ({
  updateUserProfile: vi.fn(),
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

vi.mock('@/lib/api/middleware/rbac', () => ({
  requireSelfOrAdmin: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/rate-limit', () => ({
  rateLimit: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/csrf', () => ({
  validateCsrfToken: vi.fn((c: any, next: any) => next()),
}));

describe('[Integration] Users API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /users/me', () => {
    it('should return authenticated user information', async () => {
      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/users', users);

      const res = await testClient(app).users.me.$get();
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('user-123');
      expect(data.data.email).toBe('test@example.com');
      expect(data.data.name).toBe('Test User');
      expect(data.data.role).toBe('user');
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user profile successfully', async () => {
      const { updateUserProfile } = await import('@/lib/db/user-profiles');

      const updatedProfile = {
        id: 'user-123',
        root_account_id: 'root-123',
        display_name: 'Updated Name',
        avatar_url: 'https://example.com/avatar.jpg',
        purpose: 'Updated Purpose',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      };

      vi.mocked(updateUserProfile).mockResolvedValue(updatedProfile as any);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/users', users);

      const res = await testClient(app).users[':id'].$patch({
        param: { id: 'user-123' },
        json: {
          display_name: 'Updated Name',
          avatar_url: 'https://example.com/avatar.jpg',
          purpose: 'Updated Purpose',
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.display_name).toBe('Updated Name');
      expect(data.data.avatar_url).toBe('https://example.com/avatar.jpg');
    });

    it('should return 404 when user not found', async () => {
      const { updateUserProfile } = await import('@/lib/db/user-profiles');
      vi.mocked(updateUserProfile).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/users', users);

      const res = await testClient(app).users[':id'].$patch({
        param: { id: 'non-existent' },
        json: { display_name: 'New Name' },
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should accept purposes array', async () => {
      const { updateUserProfile } = await import('@/lib/db/user-profiles');

      const updatedProfile = {
        id: 'user-123',
        root_account_id: 'root-123',
        display_name: 'Test User',
        purposes: ['purpose1', 'purpose2', 'purpose3'],
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      };

      vi.mocked(updateUserProfile).mockResolvedValue(updatedProfile as any);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/users', users);

      const res = await testClient(app).users[':id'].$patch({
        param: { id: 'user-123' },
        json: {
          purposes: ['purpose1', 'purpose2', 'purpose3'],
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.purposes).toEqual(['purpose1', 'purpose2', 'purpose3']);
    });

    it('should accept external_links as record', async () => {
      const { updateUserProfile } = await import('@/lib/db/user-profiles');

      const updatedProfile = {
        id: 'user-123',
        root_account_id: 'root-123',
        display_name: 'Test User',
        external_links: {
          twitter: 'https://twitter.com/test',
          github: 'https://github.com/test',
        },
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z',
      };

      vi.mocked(updateUserProfile).mockResolvedValue(updatedProfile as any);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/users', users);

      const res = await testClient(app).users[':id'].$patch({
        param: { id: 'user-123' },
        json: {
          external_links: {
            twitter: 'https://twitter.com/test',
            github: 'https://github.com/test',
          },
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.external_links).toEqual({
        twitter: 'https://twitter.com/test',
        github: 'https://github.com/test',
      });
    });
  });
});
