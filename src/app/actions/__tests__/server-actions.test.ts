/**
 * Server Action Tests
 *
 * Test suite for Server Actions:
 * - createGroupAction
 * - createNationAction
 * - Input validation
 * - Authorization checks
 *
 * @requirement: pnpm test src/app/actions/__tests__/server-actions.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGroupAction } from '@/app/actions/create-group';
import { createNationAction } from '@/app/actions/create-nation';
import { getSession } from '@/lib/auth/helper';

// Mock getSession
vi.mock('@/lib/auth/helper', () => ({
  getSession: vi.fn(),
}));

describe('Server Actions - Authorization & Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // createGroupAction Tests
  // ============================================================================

  describe('createGroupAction', () => {
    it('should fail when user is not authenticated', async () => {
      (getSession as any).mockResolvedValue(null);

      const result = await createGroupAction({
        name: 'Test Group',
        description: 'Test Description',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should fail when group name is empty', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'member' },
      });

      const result = await createGroupAction({
        name: '',
        description: 'Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/required/i);
    });

    it('should fail when group name is too short', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'member' },
      });

      const result = await createGroupAction({
        name: 'ab',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/3 characters/i);
    });

    it('should fail when group name is too long', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'member' },
      });

      const result = await createGroupAction({
        name: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/100 characters/i);
    });

    it('should reject when description exceeds 500 chars', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com' },
      });

      const result = await createGroupAction({
        name: 'Valid Group',
        description: 'x'.repeat(501),
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/500 characters/i);
    });
  });

  // ============================================================================
  // createNationAction Tests
  // ============================================================================

  describe('createNationAction', () => {
    it('should fail when user is not authenticated', async () => {
      (getSession as any).mockResolvedValue(null);

      const result = await createNationAction({
        groupId: 'group-1',
        name: 'Test Nation',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });

    it('should fail when user role is not group_leader or platform_admin', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'member' },
      });

      const result = await createNationAction({
        groupId: 'group-1',
        name: 'Test Nation',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Unauthorized/i);
    });

    it('should fail when groupId is empty', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'group_leader' },
      });

      const result = await createNationAction({
        groupId: '',
        name: 'Test Nation',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Group ID is required');
    });

    it('should fail when nation name is too short', async () => {
      (getSession as any).mockResolvedValue({
        user: { id: 'user-1', email: 'test@example.com', role: 'group_leader' },
      });

      const result = await createNationAction({
        groupId: 'group-1',
        name: 'ab',
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/3 characters/i);
    });
  });
});
