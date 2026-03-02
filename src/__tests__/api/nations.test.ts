/**
 * Nations API Integration Tests
 *
 * @description
 * - GET /api/nations - ネーション一覧取得
 * - GET /api/nations/:id - ネーション詳細取得
 * - PATCH /api/nations/:id - ネーション更新（リーダーのみ）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { Hono } from 'hono';
import nations from '@/lib/api/routes/nations';
import type { SessionContext } from '@/lib/api/middleware/auth';

// DB functions をモック
vi.mock('@/lib/db/nations', () => ({
  getNations: vi.fn(),
  getNationById: vi.fn(),
  updateNation: vi.fn(),
}));

vi.mock('@/lib/api/middleware/auth', () => ({
  requireAuth: vi.fn((c, next) => next()),
}));

vi.mock('@/lib/api/middleware/rbac', () => ({
  requireNationRole: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/rate-limit', () => ({
  rateLimit: vi.fn(() => (c: any, next: any) => next()),
}));

vi.mock('@/lib/api/middleware/csrf', () => ({
  validateCsrfToken: vi.fn((c: any, next: any) => next()),
}));

describe('[Integration] Nations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /nations', () => {
    it('should return list of nations with default limit', async () => {
      const { getNations } = await import('@/lib/db/nations');
      const mockNations = [
        {
          id: 'nation-1',
          name: 'Test Nation 1',
          description: 'Description 1',
          isOfficial: false,
          avatarUrl: null,
          coverUrl: null,
          ownerUserId: 'user-1',
          ownerGroupId: null,
          transactionFeeRate: '10.0',
          foundationFee: 1000,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 'nation-2',
          name: 'Test Nation 2',
          description: 'Description 2',
          isOfficial: true,
          avatarUrl: null,
          coverUrl: null,
          ownerUserId: null,
          ownerGroupId: 'group-1',
          transactionFeeRate: '5.0',
          foundationFee: 500,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ];

      vi.mocked(getNations).mockResolvedValue(mockNations);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations.$get();
      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].name).toBe('Test Nation 1');
      expect(data.data[1].isOfficial).toBe(true);
    });

    it('should accept custom limit parameter', async () => {
      const { getNations } = await import('@/lib/db/nations');
      vi.mocked(getNations).mockResolvedValue([]);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations.$get({ query: { limit: '50' } });
      expect(res.status).toBe(200);

      expect(getNations).toHaveBeenCalledWith(50);
    });
  });

  describe('GET /nations/:id', () => {
    it('should return nation detail', async () => {
      const { getNationById } = await import('@/lib/db/nations');
      const mockNation = {
        id: 'nation-1',
        name: 'Test Nation',
        description: 'Test Description',
        isOfficial: false,
        avatarUrl: 'https://example.com/avatar.jpg',
        coverUrl: null,
        ownerUserId: 'user-1',
        ownerGroupId: null,
        transactionFeeRate: '10.0',
        foundationFee: 1000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      vi.mocked(getNationById).mockResolvedValue(mockNation);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations[':id'].$get({
        param: { id: 'nation-1' },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('nation-1');
      expect(data.data.name).toBe('Test Nation');
      expect(data.data.transactionFeeRate).toBe('10.0');
    });

    it('should return 404 when nation not found', async () => {
      const { getNationById } = await import('@/lib/db/nations');
      vi.mocked(getNationById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations[':id'].$get({
        param: { id: 'non-existent' },
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /nations/:id', () => {
    it('should update nation when user is leader', async () => {
      const { getNationById, updateNation } = await import('@/lib/db/nations');

      const existingNation = {
        id: 'nation-1',
        name: 'Old Nation Name',
        description: 'Old Description',
        isOfficial: false,
        avatarUrl: null,
        coverUrl: null,
        ownerUserId: 'user-1',
        ownerGroupId: null,
        transactionFeeRate: '10.0',
        foundationFee: 1000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const updatedNation = {
        ...existingNation,
        name: 'New Nation Name',
        description: 'New Description',
        transactionFeeRate: '5.0',
      };

      vi.mocked(getNationById).mockResolvedValue(existingNation);
      vi.mocked(updateNation).mockResolvedValue(updatedNation);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations[':id'].$patch({
        param: { id: 'nation-1' },
        json: {
          name: 'New Nation Name',
          description: 'New Description',
          transactionFeeRate: '5.0',
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('New Nation Name');
      expect(data.data.description).toBe('New Description');
      expect(data.data.transactionFeeRate).toBe('5.0');
    });

    it('should return 404 when updating non-existent nation', async () => {
      const { getNationById } = await import('@/lib/db/nations');
      vi.mocked(getNationById).mockResolvedValue(undefined);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations[':id'].$patch({
        param: { id: 'non-existent' },
        json: { name: 'New Name' },
      });

      expect(res.status).toBe(404);

      const data = (await res.json()) as any;
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });

    it('should validate transactionFeeRate as string', async () => {
      const { getNationById, updateNation } = await import('@/lib/db/nations');

      const existingNation = {
        id: 'nation-1',
        name: 'Test Nation',
        description: 'Description',
        isOfficial: false,
        avatarUrl: null,
        coverUrl: null,
        ownerUserId: 'user-1',
        ownerGroupId: null,
        transactionFeeRate: '10.0',
        foundationFee: 1000,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const updatedNation = {
        ...existingNation,
        transactionFeeRate: '15.5',
      };

      vi.mocked(getNationById).mockResolvedValue(existingNation);
      vi.mocked(updateNation).mockResolvedValue(updatedNation);

      const app = new Hono<{ Variables: SessionContext }>();
      app.route('/nations', nations);

      const res = await testClient(app).nations[':id'].$patch({
        param: { id: 'nation-1' },
        json: {
          transactionFeeRate: '15.5', // string型として送信
        },
      });

      expect(res.status).toBe(200);

      const data = (await res.json()) as any;
      expect(data.success).toBe(true);
      expect(data.data.transactionFeeRate).toBe('15.5');
    });
  });
});
