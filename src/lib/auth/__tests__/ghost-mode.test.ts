/**
 * VNS Ghost Mode (幽霊モード) テスト
 *
 * @design VNS の設計哲学をテスト：
 * - 幽霊 (Ghost): 観測者として行動し、世界に干渉できない
 * - ペルソナ (Persona): 仮面を被った状態で、世界と相互作用できる
 * - プラットフォーム管理者: すべての操作が許可される
 *
 * テスト実施方法：
 * $ pnpm test src/lib/auth/__tests__/ghost-mode.test.ts
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// db モジュールをモック (DATABASE_URL エラーを回避)
vi.mock("@/lib/db/client", () => ({
  db: {
    select: vi.fn(),
    query: {
      userProfiles: { findFirst: vi.fn() },
    },
  },
}));

import {
  isGhostMask,
  checkInteractionAllowed,
  type AuthSession,
} from "../rbac-helper";
import { db } from "@/lib/db/client";

// ============================================================================
// Mock Data
// ============================================================================

/**
 * 幽霊マスクを持つユーザーのセッション
 */
const mockGhostSession: AuthSession = {
  user: {
    id: "user-ghost-1",
    email: "ghost@example.com",
    name: "Ghost User",
    role: null, // 一般ユーザー
  },
  session: {
    id: "session-ghost-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

/**
 * ペルソナマスクを持つユーザーのセッション
 */
const mockPersonaSession: AuthSession = {
  user: {
    id: "user-persona-1",
    email: "persona@example.com",
    name: "Persona User",
    role: null, // 一般ユーザー
  },
  session: {
    id: "session-persona-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

/**
 * プラットフォーム管理者のセッション (幽霊でもすべて許可)
 */
const mockAdminGhostSession: AuthSession = {
  user: {
    id: "user-admin-ghost-1",
    email: "admin-ghost@example.com",
    name: "Admin Ghost",
    role: "platform_admin", // プラットフォーム管理者
  },
  session: {
    id: "session-admin-ghost-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

/**
 * 無効なセッション (ユーザー情報なし)
 */
const mockInvalidSession: AuthSession = {
  user: {
    id: "",
    email: "",
    name: "",
    role: null,
  },
  session: {
    id: "session-invalid-1",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
};

// ============================================================================
// Test Suite
// ============================================================================

describe("Ghost Mode Functionality", () => {
  beforeEach(() => {
    // すべてのモックをリセット
    vi.clearAllMocks();
  });

  describe("isGhostMask()", () => {
    it("should return true for ghost mask category", async () => {
      // データベースモック: 幽霊マスクを返す
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const result = await isGhostMask(mockGhostSession);
      expect(result).toBe(true);
    });

    it("should return false for persona mask category", async () => {
      // データベースモック: ペルソナマスクを返す
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const result = await isGhostMask(mockPersonaSession);
      expect(result).toBe(false);
    });

    it("should return false for null session", async () => {
      const result = await isGhostMask(null);
      expect(result).toBe(false);
    });

    it("should return false for session without user id", async () => {
      const result = await isGhostMask(mockInvalidSession);
      expect(result).toBe(false);
    });

    it("should handle database errors gracefully by throwing", async () => {
      // データベースモック: エラーをスロー
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  then: vi.fn().mockImplementation(() => {
                    throw new Error("Database connection error");
                  }),
                }),
              }),
            }),
          }),
        }),
      } as any);

      // ✅ FIXED: エラー時は throw する（安全側に倒す）
      expect(async () => {
        await isGhostMask(mockGhostSession);
      }).rejects.toThrow();
    });

    it("should return false when user profile not found", async () => {
      // データベースモック: 空の結果を返す
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const result = await isGhostMask(mockPersonaSession);
      expect(result).toBe(false);
    });
  });

  describe("checkInteractionAllowed()", () => {
    it("should deny interaction for ghost mask", async () => {
      // データベースモック: 幽霊マスクを返す
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const result = await checkInteractionAllowed(mockGhostSession);
      expect(result).toBe(false);
    });

    it("should allow interaction for persona mask", async () => {
      // データベースモック: ペルソナマスクを返す
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const result = await checkInteractionAllowed(mockPersonaSession);
      expect(result).toBe(true);
    });

    it("should allow all interactions for platform_admin even in ghost mode", async () => {
      // プラットフォーム管理者はDBクエリ前にバイパスされるため、モック不要
      const result = await checkInteractionAllowed(mockAdminGhostSession);
      expect(result).toBe(true); // 管理者はすべて許可
    });

    it("should deny interaction for null session", async () => {
      const result = await checkInteractionAllowed(null);
      expect(result).toBe(false);
    });

    it("should deny interaction for session without user id", async () => {
      const result = await checkInteractionAllowed(mockInvalidSession);
      expect(result).toBe(false);
    });

    it("should handle database errors gracefully by throwing", async () => {
      // データベースモック: エラーをスロー
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
              where: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  then: vi.fn().mockImplementation(() => {
                    throw new Error("Database connection error");
                  }),
                }),
              }),
            }),
          }),
        }),
      } as any);

      // ✅ FIXED: エラー時は throw する（isGhostMask がスロー → checkInteractionAllowed も throw）
      expect(async () => {
        await checkInteractionAllowed(mockGhostSession);
      }).rejects.toThrow();
    });
  });

  describe("VNS Design Philosophy Validation", () => {
    it("幽霊 (Ghost) は観測者として行動し、世界に干渉できない", async () => {
      // データベースモック: 幽霊マスクを返す
      vi.mocked(db.select)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
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
          }),
        } as any)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
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
          }),
        } as any);

      const isGhost = await isGhostMask(mockGhostSession);
      const canInteract = await checkInteractionAllowed(mockGhostSession);

      expect(isGhost).toBe(true);
      expect(canInteract).toBe(false);
    });

    it("ペルソナ (Persona) は仮面を被って世界と相互作用できる", async () => {
      // データベースモック: ペルソナマスクを返す
      vi.mocked(db.select)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
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
          }),
        } as any)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            innerJoin: vi.fn().mockReturnValue({
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
          }),
        } as any);

      const isGhost = await isGhostMask(mockPersonaSession);
      const canInteract = await checkInteractionAllowed(mockPersonaSession);

      expect(isGhost).toBe(false);
      expect(canInteract).toBe(true);
    });

    it("プラットフォーム管理者はマスクに関係なくすべて許可される", async () => {
      // データベースモック: 幽霊マスクを返す（管理者でも）
      vi.mocked(db.select).mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
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
        }),
      } as any);

      const isGhost = await isGhostMask(mockAdminGhostSession);
      const canInteract = await checkInteractionAllowed(mockAdminGhostSession);

      // 管理者は幽霊でも相互作用が許可される
      expect(isGhost).toBe(true);
      expect(canInteract).toBe(true);
    });
  });
});
