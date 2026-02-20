import { beforeEach, describe, expect, it, vi } from "vitest";

// DB モジュールのモック
vi.mock("@/lib/db/drizzle-postgres", () => ({
  db: {
    select: vi.fn(),
  },
}));

// スキーマのモック
vi.mock("@/lib/db/schema.postgres", () => ({
  rootAccounts: {
    id: "id",
    authUserId: "auth_user_id",
  },
}));

// drizzle-orm のモック
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((field, value) => ({ field, value })),
}));

import { db } from "@/lib/db/drizzle-postgres";
import { getRootAccountId, hasRootAccount } from "./root-account-guard";

describe("hasRootAccount", () => {
  // チェーンメソッドのモック
  const mockLimit = vi.fn();
  const mockWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockFrom = vi.fn(() => ({ where: mockWhere }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as never);
  });

  it("ルートアカウントが存在する場合、trueを返す", async () => {
    // Arrange
    const userId = "user-123";
    mockLimit.mockResolvedValue([{ id: "root-1" }]);

    // Act
    const result = await hasRootAccount(userId);

    // Assert
    expect(result).toBe(true);
  });

  it("ルートアカウントが存在しない場合、falseを返す", async () => {
    // Arrange
    const userId = "user-no-root";
    mockLimit.mockResolvedValue([]);

    // Act
    const result = await hasRootAccount(userId);

    // Assert
    expect(result).toBe(false);
  });
});

describe("getRootAccountId", () => {
  const mockLimit = vi.fn();
  const mockWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockFrom = vi.fn(() => ({ where: mockWhere }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(db.select).mockReturnValue({ from: mockFrom } as never);
  });

  it("ルートアカウントIDを返す", async () => {
    // Arrange
    const userId = "user-123";
    mockLimit.mockResolvedValue([{ id: "root-abc" }]);

    // Act
    const result = await getRootAccountId(userId);

    // Assert
    expect(result).toBe("root-abc");
  });

  it("ルートアカウントが存在しない場合、nullを返す", async () => {
    // Arrange
    const userId = "user-no-root";
    mockLimit.mockResolvedValue([]);

    // Act
    const result = await getRootAccountId(userId);

    // Assert
    expect(result).toBeNull();
  });
});
