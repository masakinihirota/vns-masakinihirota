import { logger } from "@/lib/logger";

logger.debug("STARTING rbac-boundary-cases.test.ts");
/**
 * RBAC Boundary Cases Test Suite
 *
 * platform_admin / ghost / persona の境界ケーステスト
 * Task 5.1: Priority 2 の実装
 *
 * テスト対象:
 * - platform_admin と通常ユーザーの権限境界
 * - ghost / persona モード切り替えの境界
 * - 権限階層の境界（leader vs sub_leader など）
 * - active_profile_id の異常系境界
 *
 * 実行方法:
 * $ pnpm test src/lib/auth/__tests__/rbac-boundary-cases.test.ts
 */

logger.debug("rbac-boundary-cases.test.ts is being loaded");
import { beforeEach, describe, expect, it, vi } from "vitest";

// ============================================================================
// Mocks (Hoisted by Vitest)
// ============================================================================

// 1. Heavy schema file をモック (esbuild クラッシュ回避)
vi.mock("@/lib/db/schema.postgres", () => ({
  userProfiles: { id: "user_profiles_id_col", userId: "user_id_col", rootAccountId: "root_account_id_col", maskCategory: "mask_category_col" },
  groupMembers: { groupId: "group_id_col", userProfileId: "user_profile_id_col", role: "role_col" },
  nationGroups: { nationId: "nation_id_col", groupId: "group_id_col", role: "role_col" },
  relationships: { userProfileId: "user_profile_id_col", targetProfileId: "target_profile_id_col", relationship: "relationship_col" },
  rootAccounts: { id: "root_accounts_id_col", authUserId: "auth_user_id_col", activeProfileId: "active_profile_id_col" },
  nationCitizens: { nationId: "nation_id_col", userProfileId: "user_profile_id_col" },
}));

// 2. React.cache を mock
vi.mock("react", async () => {
  return {
    cache: (fn: any) => fn, // cache を pass-through に
  };
});

// 3. DATABASE_URL エラー回避のための DB client モック
vi.mock("@/lib/db/client", () => {
  const mockDb = {
    select: vi.fn(),
    query: {
      userProfiles: { findFirst: vi.fn() },
      groupMembers: { findFirst: vi.fn() },
      nationCitizens: { findFirst: vi.fn() },
      nationGroups: { findFirst: vi.fn() },
    },
  };
  return { db: mockDb };
});

import { db } from "@/lib/db/client";
import {
  checkGroupRole,
  checkInteractionAllowed,
  checkNationRole,
  type AuthSession
} from "../rbac-helper";

// ============================================================================
// Helpers
// ============================================================================

/**
 * Drizzle のメソッドチェーンをモックするヘルパー
 */
function mockDrizzleChain(data: any[] = []) {
  const chain: any = {
    from: vi.fn().mockReturnThis(),
    innerJoin: vi.fn().mockReturnThis(),
    leftJoin: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue(data),
    then: (resolve: any) => Promise.resolve(data).then(resolve),
    catch: (reject: any) => Promise.resolve(data).catch(reject),
  };
  return chain;
}

// ============================================================================
// Mock Data
// ============================================================================

const adminSession: AuthSession = {
  user: { id: "admin-user", email: "admin@example.com", name: "Admin", role: "platform_admin" },
  session: { id: "550e8400-e29b-41d4-a716-446655440000", expiresAt: new Date(Date.now() + 86400000) },
};

const personaSession: AuthSession = {
  user: { id: "user-1", email: "user1@example.com", name: "User 1", role: "user" },
  session: { id: "550e8400-e29b-41d4-a716-446655440001", expiresAt: new Date(Date.now() + 86400000) },
};

// ============================================================================
// Test Suite
// ============================================================================

describe("RBAC Boundary Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // デフォルトで getUserProfileId が成功するように設定
    vi.mocked(db.select).mockImplementation(() => {
      return mockDrizzleChain([{ userProfileId: "550e8400-e29b-41d4-a716-446655440001", maskCategory: "persona" }]) as any;
    });
  });

  describe("Platform Admin Bypass", () => {
    it("platform_admin はグループ権限チェックを常にパスする", async () => {
      // 100%パスすることを確認
      const result = await checkGroupRole(adminSession, "550e8400-e29b-41d4-a716-446655440002", "leader");
      expect(result).toBe(true);

      // platform_admin の場合、内部の _checkGroupRoleInternal (DBクエリを含む) は呼ばれないはず。
      // ただし audit-logger などで db.select が呼ばれる可能性はあるため、結果が true であることが重要。
    });

    it("platform_admin は国権限チェックを常にパスする", async () => {
      const result = await checkNationRole(adminSession, "550e8400-e29b-41d4-a716-446655440003", "leader");
      expect(result).toBe(true);
    });
  });

  describe("Ghost vs Persona Mode", () => {
    it("Ghost モードのユーザーはインタラクションを制限される", async () => {
      // isGhostMask の判定ロジックをモック
      vi.mocked(db.select).mockImplementationOnce(() => {
        logger.debug("db.select mock for GHOST called");
        return mockDrizzleChain([{ maskCategory: "ghost", userProfileId: "profile-1" }]) as any;
      });

      try {
        const result = await checkInteractionAllowed(personaSession);
        expect(result).toBe(false);
      } catch (e) {
        logger.error("TEST ERROR", undefined, { error: e });
        throw e;
      }
    });

    it("Persona モードのユーザーはインタラクションを許可される", async () => {
      // 1. isGhostMask -> false
      vi.mocked(db.select).mockImplementationOnce(() => {
        logger.debug("db.select mock for PERSONA called");
        return mockDrizzleChain([{ maskCategory: "persona", userProfileId: "profile-1" }]) as any;
      });

      const result = await checkInteractionAllowed(personaSession);
      expect(result).toBe(true);
    });
  });

  describe("Role Hierarchy Boundaries", () => {
    it("sub_leader は mediator 権限を必要とする操作をパスする", async () => {
      // db.select は2回呼ばれる: 1回目=getUserProfileId, 2回目=checkGroupRoleInternal
      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // 1回目: getUserProfileId 用
          return mockDrizzleChain([{ userProfileId: "550e8400-e29b-41d4-a716-446655440001", maskCategory: "persona" }]) as any;
        } else {
          // 2回目以降: checkGroupRoleInternal 用
          return mockDrizzleChain([{ role: "sub_leader" }]) as any;
        }
      });

      const result = await checkGroupRole(personaSession, "550e8400-e29b-41d4-a716-446655440002", "mediator");
      expect(result).toBe(true);
    });

    it("member は sub_leader 権限を必要とする操作を拒否される", async () => {
      // db.select は2回呼ばれる: 1回目=getUserProfileId, 2回目=checkGroupRoleInternal
      let callCount = 0;
      vi.mocked(db.select).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // 1回目: getUserProfileId 用
          return mockDrizzleChain([{ userProfileId: "550e8400-e29b-41d4-a716-446655440001", maskCategory: "persona" }]) as any;
        } else {
          // 2回目以降: checkGroupRoleInternal 用
          return mockDrizzleChain([{ role: "member" }]) as any;
        }
      });

      const result = await checkGroupRole(personaSession, "550e8400-e29b-41d4-a716-446655440002", "sub_leader");
      expect(result).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("ユーザーが見つからない場合は権限なし（false）を返す", async () => {
      // getUserProfileId が null を返すようにモック
      vi.mocked(db.select).mockImplementation(() => mockDrizzleChain([]) as any);

      const result = await checkGroupRole(personaSession, "550e8400-e29b-41d4-a716-446655440002", "member");
      expect(result).toBe(false);
    });

    it("不正なUUID形式のIDはバリデーションで弾かれfalseを返す", async () => {
      // checkGroupRole は validateUUID でエラーをキャッチして false を返す設計
      const result = await checkGroupRole(personaSession, "invalid-uuid", "member");
      expect(result).toBe(false);
    });
  });
});
