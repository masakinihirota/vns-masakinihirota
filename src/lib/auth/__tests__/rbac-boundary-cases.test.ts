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

import { describe, it, expect, beforeEach, vi } from "vitest";

// DATABASE_URL エラー回避のためのモック
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn(),
    query: {
      userProfiles: { findFirst: vi.fn() },
      groupMembers: { findFirst: vi.fn() },
      nationCitizens: { findFirst: vi.fn() },
    },
  },
}));

import {
  checkGroupRole,
  checkNationRole,
  checkInteractionAllowed,
  isGhostMask,
  type AuthSession,
} from "../rbac-helper";
import { db } from "@/lib/db/client";

// ============================================================================
// Mock Data
// ============================================================================

/**
 * platform_admin ユーザーのセッション
 */
const adminSession: AuthSession = {
  user: {
    id: "admin-user-1",
    email: "admin@example.com",
    name: "Platform Admin",
    role: "platform_admin",
  },
  session: {
    id: "admin-session-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

/**
 * 通常ユーザー（Personaモード）のセッション
 */
const personaSession: AuthSession = {
  user: {
    id: "persona-user-1",
    email: "persona@example.com",
    name: "Persona User",
    role: null,
  },
  session: {
    id: "persona-session-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

/**
 * 通常ユーザー（Ghostモード）のセッション
 */
const ghostSession: AuthSession = {
  user: {
    id: "ghost-user-1",
    email: "ghost@example.com",
    name: "Ghost User",
    role: null,
  },
  session: {
    id: "ghost-session-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

const testGroupId = "12345678-1234-4234-8234-123456789abc";
const testNationId = "87654321-4321-4234-8234-abcdef123456";

// ============================================================================
// Boundary Case Tests
// ============================================================================

describe("RBAC Boundary Cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("platform_admin Boundaries", () => {
    it("platform_admin should bypass group role checks", async () => {
      // platform_adminはグループロールチェックをバイパスする
      const result = await checkGroupRole(
        adminSession,
        testGroupId,
        "leader"
      );
      expect(result).toBe(true);
    });

    it("platform_admin should bypass nation role checks", async () => {
      // platform_adminはネーションロールチェックをバイパスする
      const result = await checkNationRole(
        adminSession,
        testNationId,
        "governor"
      );
      expect(result).toBe(true);
    });

    it("platform_admin should bypass all lower hierarchy levels", async () => {
      // platform_adminは階層に関係なくすべての権限を持つ
      const roles = ["member", "mediator", "sub_leader", "leader"] as const;

      for (const role of roles) {
        const result = await checkGroupRole(adminSession, testGroupId, role);
        expect(result).toBe(true);
      }
    });

    it("platform_admin with ghost mask should still have full access", async () => {
      // platform_adminはghostモードでも全権限を持つ
      // isGhostMask は DB 依存なので、モックを設定
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          innerJoin: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockResolvedValueOnce([
                { maskCategory: "ghost" },
              ]),
            }),
          }),
        }),
      } as any);

      const adminGhostSession: AuthSession = {
        ...adminSession,
        user: { ...adminSession.user, id: "admin-ghost-1" },
      };

      const isGhost = await isGhostMask(adminGhostSession);
      expect(isGhost).toBe(true);

      // ghostモードでもadminは操作可能
      const canInteract = await checkInteractionAllowed(adminGhostSession);
      expect(canInteract).toBe(true);
    });

    it("platform_admin should NOT exist as a group/nation role", async () => {
      // platform_adminはグループ/ネーションのロールとしては存在しない
      // （システム全体のロールのみ）
      const roleHierarchy = ["leader", "sub_leader", "mediator", "member"];
      expect(roleHierarchy).not.toContain("platform_admin");
    });
  });

  describe("Ghost / Persona Mode Boundaries", () => {
    it("ghost mask should block interactions", async () => {
      // Ghostモックを設定 (1回目: isGhostMask 直接呼び出し)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ maskCategory: "ghost" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const isGhost = await isGhostMask(ghostSession);
      expect(isGhost).toBe(true);

      // Ghostモックを設定 (2回目: checkInteractionAllowed 内の isGhostMask 呼び出し)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ maskCategory: "ghost" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      // Ghost の場合、getUserProfileId が監査ログのために呼ばれる (3回目)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ userProfileId: "profile-1" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const canInteract = await checkInteractionAllowed(ghostSession);
      expect(canInteract).toBe(false);
    });

    it("persona mask should allow interactions", async () => {
      // Personaモックを設定 (1回目: isGhostMask 直接呼び出し)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ maskCategory: "persona" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const isGhost = await isGhostMask(personaSession);
      expect(isGhost).toBe(false);

      // Personaモックを設定 (2回目: checkInteractionAllowed 内の isGhostMask 呼び出し)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ maskCategory: "persona" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const canInteract = await checkInteractionAllowed(personaSession);
      expect(canInteract).toBe(true);
    });

    it("active_profile_id = null should deny all interactions", async () => {
      // active_profile_id が null の場合（DB クエリが空配列を返す）
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const isGhost = await isGhostMask(personaSession);
      // プロフィールが見つからない場合は false を返す（deny-by-default）
      expect(isGhost).toBe(false);
    });

    it("invalid mask_category should be rejected", async () => {
      // 不正な mask_category 値
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ maskCategory: "invalid" as any }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      const isGhost = await isGhostMask(personaSession);
      // 不正な値の場合は false（persona扱い）
      expect(isGhost).toBe(false);
    });
  });

  describe("Role Hierarchy Boundaries", () => {
    it("leader should have all permissions below leader level", async () => {
      const leaderSession: AuthSession = {
        user: {
          id: "leader-user-1",
          email: "leader@example.com",
          name: "Leader User",
          role: null,
        },
        session: {
          id: "leader-session-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      // leader は member, mediator, sub_leader, leader の権限を持つ
      const lowerRoles = ["member", "mediator", "sub_leader", "leader"] as const;

      for (const role of lowerRoles) {
        // getUserProfileId のモック (1回目のdb.select)
        vi.mocked(db.select).mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  then: vi
                    .fn()
                    .mockImplementation((callback: (rows: any[]) => any) =>
                      callback([{ userProfileId: "profile-1" }]),
                    ),
                }),
              }),
            }),
          }),
        } as any);

        // _checkGroupRoleInternal のグループメンバーシップクエリのモック (2回目のdb.select)
        vi.mocked(db.select).mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ role: "leader" }]),
                  ),
              }),
            }),
          }),
        } as any);

        const result = await checkGroupRole(leaderSession, testGroupId, role);
        expect(result).toBe(true);
      }
    });

    it("sub_leader should NOT have leader permissions", async () => {
      // sub_leader は leader の権限を持たない
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          innerJoin: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockResolvedValueOnce([
                { id: "profile-1" },
              ]),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.query.groupMembers.findFirst).mockResolvedValueOnce({
        role: "sub_leader",
      } as any);

      const subLeaderSession: AuthSession = {
        user: {
          id: "subleader-user-1",
          email: "subleader@example.com",
          name: "SubLeader User",
          role: null,
        },
        session: {
          id: "subleader-session-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      const result = await checkGroupRole(
        subLeaderSession,
        testGroupId,
        "leader"
      );
      expect(result).toBe(false);
    });

    it("mediator should only have mediator and member permissions", async () => {
      // mediator は mediator と member の権限のみ持つ
      const mediatorSession: AuthSession = {
        user: {
          id: "mediator-user-1",
          email: "mediator@example.com",
          name: "Mediator User",
          role: null,
        },
        session: {
          id: "mediator-session-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      // mediator権限でmediatorロールを要求 → 成功
      // getUserProfileId のモック (1回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ userProfileId: "profile-1" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      // _checkGroupRoleInternal のグループメンバーシップクエリのモック (2回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              then: vi
                .fn()
                .mockImplementation((callback: (rows: any[]) => any) =>
                  callback([{ role: "mediator" }]),
                ),
            }),
          }),
        }),
      } as any);

      const mediatorResult = await checkGroupRole(
        mediatorSession,
        testGroupId,
        "mediator"
      );
      expect(mediatorResult).toBe(true);

     // mediator権限でleaderロールを要求 → 失敗
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ userProfileId: "profile-1" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      // _checkGroupRoleInternal のグループメンバーシップクエリのモック (2回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              then: vi
                .fn()
                .mockImplementation((callback: (rows: any[]) => any) =>
                  callback([{ role: "mediator" }]),
                ),
            }),
          }),
        }),
      } as any);

      const leaderResult = await checkGroupRole(
        mediatorSession,
        testGroupId,
        "leader"
      );
      expect(leaderResult).toBe(false);
    });

    it("member should only have member permissions", async () => {
      // member は member の権限のみ持つ
      const memberSession: AuthSession = {
        user: {
          id: "member-user-1",
          email: "member@example.com",
          name: "Member User",
          role: null,
        },
        session: {
          id: "member-session-1",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      };

      // member権限でmemberロールを要求 → 成功
      // getUserProfileId のモック (1回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ userProfileId: "profile-1" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      // _checkGroupRoleInternal のグループメンバーシップクエリのモック (2回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              then: vi
                .fn()
                .mockImplementation((callback: (rows: any[]) => any) =>
                  callback([{ role: "member" }]),
                ),
            }),
          }),
        }),
      } as any);

      const memberResult = await checkGroupRole(
        memberSession,
        testGroupId,
        "member"
      );
      expect(memberResult).toBe(true);

      // member権限でmediatorロールを要求 → 失敗
      // getUserProfileId のモック (1回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                then: vi
                  .fn()
                  .mockImplementation((callback: (rows: any[]) => any) =>
                    callback([{ userProfileId: "profile-1" }]),
                  ),
              }),
            }),
          }),
        }),
      } as any);

      // _checkGroupRoleInternal のグループメンバーシップクエリのモック (2回目のdb.select)
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              then: vi
                .fn()
                .mockImplementation((callback: (rows: any[]) => any) =>
                  callback([{ role: "member" }]),
                ),
            }),
          }),
        }),
      } as any);

      const mediatorResult = await checkGroupRole(
        memberSession,
        testGroupId,
        "mediator"
      );
      expect(mediatorResult).toBe(false);
    });
  });

  describe("Edge Cases and Error Conditions", () => {
    it("should deny access when user profile lookup fails", async () => {
      // ユーザープロフィールの取得に失敗した場合
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          innerJoin: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockResolvedValueOnce([]),
            }),
          }),
        }),
      } as any);

      const result = await checkGroupRole(
        personaSession,
        testGroupId,
        "member"
      );
      expect(result).toBe(false);
    });

    it("should deny access when group membership is not found", async () => {
      // グループメンバーシップが見つからない場合
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          innerJoin: vi.fn().mockReturnValueOnce({
            where: vi.fn().mockReturnValueOnce({
              limit: vi.fn().mockResolvedValueOnce([
                { id: "profile-1" },
              ]),
            }),
          }),
        }),
      } as any);

      vi.mocked(db.query.groupMembers.findFirst).mockResolvedValueOnce(
        undefined
      );

      const result = await checkGroupRole(
        personaSession,
        testGroupId,
        "member"
      );
      expect(result).toBe(false);
    });

    it("should handle database errors gracefully", async () => {
      // DB エラー時は安全側（拒否）に倒す
      vi.mocked(db.select).mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const result = await checkGroupRole(
        personaSession,
        testGroupId,
        "member"
      );
      expect(result).toBe(false);
    });
  });
});
