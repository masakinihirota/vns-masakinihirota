/**
 * Groups API Integration Tests
 *
 * @description
 * - GET /api/groups - グループ一覧取得
 * - GET /api/groups/:id - グループ詳細取得
 * - PATCH /api/groups/:id - グループ更新（リーダーのみ）
 * - GET /api/groups/:id/members - グループメンバー一覧取得
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import groups from '@/lib/api/routes/groups';
import type { SessionContext } from '@/lib/api/middleware/auth';

// DB functions をモック
vi.mock('@/lib/db/groups', () => ({
  getGroups: vi.fn(),
  getGroupById: vi.fn(),
  updateGroup: vi.fn(),
  getGroupMembers: vi.fn(),
}));

vi.mock('@/lib/api/middleware/auth', () => ({
  requireAuth: vi.fn((c, next) => next()),
}));

vi.mock('@/lib/api/middleware/rbac', () => ({
  requireGroupRole: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/rate-limit', () => ({
  rateLimit: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/csrf', () => ({
  validateCsrfToken: vi.fn((c: any, next: any) => next()),
}));

describe('[Integration] Groups API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /groups', () => {
    it('should return list of groups with default limit', async () => {
      const { getGroups } = await import('@/lib/db/groups');
      const mockGroups = [
        {
          id: 'group-1',
          name: 'Test Group 1',
          description: 'Description 1',
          avatarUrl: null,
          coverUrl: null,
          leaderId: 'user-1',
          isPrivate: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'group-2',
          name: 'Test Group 2',
          description: 'Description 2',
          avatarUrl: null,
          coverUrl: null,
          leaderId: 'user-2',
          isPrivate: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(getGroups).mockResolvedValue(mockGroups);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups.$get();
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].name).toBe('Test Group 1');
    });

    it('should accept custom limit parameter', async () => {
      const { getGroups } = await import('@/lib/db/groups');
      vi.mocked(getGroups).mockResolvedValue([]);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups.$get({ query: { limit: '50' } });
      expect(res.status).toBe(200);

      expect(getGroups).toHaveBeenCalledWith(50);
    });
  });

  describe('GET /groups/:id', () => {
    it('should return group detail', async () => {
      const { getGroupById } = await import('@/lib/db/groups');
      const mockGroup = {
        id: 'group-1',
        name: 'Test Group',
        description: 'Test Description',
        avatarUrl: 'https://example.com/avatar.jpg',
        coverUrl: null,
        leaderId: 'user-1',
        isPrivate: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(getGroupById).mockResolvedValue(mockGroup);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups[':id'].$get({
        param: { id: 'group-1' },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('group-1');
      expect(data.data.name).toBe('Test Group');
    });

    it('should return 404 when group not found', async () => {
      const { getGroupById } = await import('@/lib/db/groups');
      vi.mocked(getGroupById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups[':id'].$get({
        param: { id: 'non-existent' },
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /groups/:id', () => {
    it('should update group when user is leader', async () => {
      const { getGroupById, updateGroup } = await import('@/lib/db/groups');

      const existingGroup = {
        id: 'group-1',
        name: 'Old Name',
        description: 'Old Description',
        avatarUrl: null,
        coverUrl: null,
        leaderId: 'user-1',
        isPrivate: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const updatedGroup = {
        ...existingGroup,
        name: 'New Name',
        description: 'New Description',
      };

      vi.mocked(getGroupById).mockResolvedValue(existingGroup);
      vi.mocked(updateGroup).mockResolvedValue(updatedGroup);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups[':id'].$patch({
        param: { id: 'group-1' },
        json: {
          name: 'New Name',
          description: 'New Description',
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('New Name');
      expect(data.data.description).toBe('New Description');
    });

    it('should return 404 when updating non-existent group', async () => {
      const { getGroupById } = await import('@/lib/db/groups');
      vi.mocked(getGroupById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await testClient(app).groups[':id'].$patch({
        param: { id: 'non-existent' },
        json: { name: 'New Name' },
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /groups/:id/members', () => {
    it('should return group members', async () => {
      const { getGroupById, getGroupMembers } = await import('@/lib/db/groups');

      // グループ存在確認のモック
      vi.mocked(getGroupById).mockResolvedValue({
        id: 'group-1',
        name: 'Test Group',
        description: 'Test Description',
        avatarUrl: null,
        coverUrl: null,
        leaderId: 'user-1',
        isPrivate: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      const mockMembers = [
        {
          userId: 'user-1',
          groupId: 'group-1',
          role: 'leader',
          joinedAt: '2024-01-01T00:00:00Z',
        },
        {
          userId: 'user-2',
          groupId: 'group-1',
          role: 'member',
          joinedAt: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(getGroupMembers).mockResolvedValue(mockMembers);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await app.request('/groups/group-1/members', {
        method: 'GET',
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].role).toBe('leader');
      expect(data.data[1].role).toBe('member');
    });

    it('should return empty array when group has no members', async () => {
      const { getGroupById, getGroupMembers } = await import('@/lib/db/groups');

      // グループ存在確認のモック
      vi.mocked(getGroupById).mockResolvedValue({
        id: 'group-1',
        name: 'Test Group',
        description: 'Test Description',
        avatarUrl: null,
        coverUrl: null,
        leaderId: 'user-1',
        isPrivate: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      });

      vi.mocked(getGroupMembers).mockResolvedValue([]);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/groups', groups);

      const res = await app.request('/groups/group-1/members', {
        method: 'GET',
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(0);
    });
  });
});
