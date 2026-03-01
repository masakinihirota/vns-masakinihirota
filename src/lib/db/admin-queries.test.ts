/**
 * Admin Dashboard Database Queries Tests
 * TDD: テスト駆動開発
 */
 

import { eq, and, or, ilike, isNull, count, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { db as database } from './client';
import { userProfiles, rootAccounts, users } from './schema.postgres';

describe('Admin Dashboard Queries', () => {
  let testRootAccountId: string;
  const testProfileIds: string[] = [];
  let testUserId: string;

  beforeAll(async () => {
    try {
      // テスト用のユーザーを作成（Better Auth 標準）
      testUserId = uuidv4();
      await database.insert(users).values({
        id: testUserId,
        name: 'Test Admin',
        email: `admin-${testUserId}@test.local`,
        emailVerified: true,
        role: 'admin',
        isAnonymous: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // テスト用のルートアカウントを作成
      testRootAccountId = uuidv4();
      await database.insert(rootAccounts).values({
        id: testRootAccountId,
        authUserId: testUserId,
        points: 3000,
        level: 1,
        trustDays: 0,
      });

      // テストプロフィール作成
      const profiles = [
        {
          id: uuidv4(),
          rootAccountId: testRootAccountId,
          displayName: 'alice',
          roleType: 'member',
          isActive: true,
        },
        {
          id: uuidv4(),
          rootAccountId: testRootAccountId,
          displayName: 'bob-admin',
          roleType: 'admin',
          isActive: true,
        },
        {
          id: uuidv4(),
          rootAccountId: testRootAccountId,
          displayName: 'charlie',
          roleType: 'member',
          isActive: false,
        },
      ];

      for (const profile of profiles) {
        await database.insert(userProfiles).values(profile);
        testProfileIds.push(profile.id);
      }
    } catch (error) {
      console.error('Setup error:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // テストデータ削除
      if (testProfileIds.length > 0) {
        await database
          .delete(userProfiles)
          .where(or(...testProfileIds.map((id) => eq(userProfiles.id, id))));
      }

      if (testRootAccountId) {
        await database
          .delete(rootAccounts)
          .where(eq(rootAccounts.id, testRootAccountId));
      }

      if (testUserId) {
        await database.delete(users).where(eq(users.id, testUserId));
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  });

  describe('searchUsers', () => {
    it('should search users by display name', async () => {
      const results = await database
        .select()
        .from(userProfiles)
        .where(
          and(
            ilike(userProfiles.displayName, '%alice%'),
            eq(userProfiles.rootAccountId, testRootAccountId)
          )
        )
        .limit(20);

      expect(results).toHaveLength(1);
      expect(results[0].displayName).toBe('alice');
    });

    it('should search users with pagination', async () => {
      const page = 1;
      const limit = 2;
      const offset = (page - 1) * limit;

      const results = await database
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.rootAccountId, testRootAccountId))
        .orderBy(desc(userProfiles.createdAt))
        .limit(limit)
        .offset(offset);

      expect(results.length).toBeLessThanOrEqual(limit);
    });

    it('should filter users by role type', async () => {
      const results = await database
        .select()
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.rootAccountId, testRootAccountId),
            eq(userProfiles.roleType, 'admin')
          )
        );

      expect(results).toHaveLength(1);
      expect(results[0].displayName).toBe('bob-admin');
    });

    it('should filter users by is_active status', async () => {
      const results = await database
        .select()
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.rootAccountId, testRootAccountId),
            eq(userProfiles.isActive, false)
          )
        );

      expect(results).toHaveLength(1);
      expect(results[0].displayName).toBe('charlie');
    });

    it('should return total count of users', async () => {
      const countResult = await database
        .select({ count: count() })
        .from(userProfiles)
        .where(eq(userProfiles.rootAccountId, testRootAccountId));

      expect(countResult[0].count).toBe(3);
    });

    it('should search users with combined filters', async () => {
      const results = await database
        .select()
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.rootAccountId, testRootAccountId),
            or(
              ilike(userProfiles.displayName, '%alice%'),
              ilike(userProfiles.displayName, '%bob%')
            ),
            eq(userProfiles.isActive, true)
          )
        );

      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.displayName === 'alice')).toBe(true);
    });
  });

  describe('User Management Operations', () => {
    it('should update user role type', async () => {
      const profileId = testProfileIds[0];

      await database
        .update(userProfiles)
        .set({ roleType: 'admin' })
        .where(eq(userProfiles.id, profileId));

      const updated = await database
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, profileId));

      expect(updated[0].roleType).toBe('admin');

      // ロールバック
      await database
        .update(userProfiles)
        .set({ roleType: 'member' })
        .where(eq(userProfiles.id, profileId));
    });

    it('should deactivate user', async () => {
      const profileId = testProfileIds[0];

      await database
        .update(userProfiles)
        .set({ isActive: false })
        .where(eq(userProfiles.id, profileId));

      const updated = await database
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, profileId));

      expect(updated[0].isActive).toBe(false);

      // ロールバック
      await database
        .update(userProfiles)
        .set({ isActive: true })
        .where(eq(userProfiles.id, profileId));
    });
  });

  describe('KPI Queries', () => {
    it('should count active users', async () => {
      const result = await database
        .select({ count: count() })
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.rootAccountId, testRootAccountId),
            eq(userProfiles.isActive, true)
          )
        );

      expect(result[0].count).toBe(2); // alice and bob-admin
    });

    it('should count inactive users', async () => {
      const result = await database
        .select({ count: count() })
        .from(userProfiles)
        .where(
          and(
            eq(userProfiles.rootAccountId, testRootAccountId),
            eq(userProfiles.isActive, false)
          )
        );

      expect(result[0].count).toBe(1); // charlie
    });

    it('should count users by role type distribution', async () => {
      const result = await database
        .select({
          roleType: userProfiles.roleType,
          count: count(),
        })
        .from(userProfiles)
        .where(eq(userProfiles.rootAccountId, testRootAccountId))
        .groupBy(userProfiles.roleType);

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
