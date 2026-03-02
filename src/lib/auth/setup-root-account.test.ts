import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  selectFrom: vi.fn(),
  selectWhere: vi.fn(),
  selectLimit: vi.fn(),
  transaction: vi.fn(),
  insert: vi.fn(),
  insertValues: vi.fn(),
  insertReturning: vi.fn(),
  update: vi.fn(),
  updateSet: vi.fn(),
  updateWhere: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/db/client", () => ({
  db: {
    select: mocks.select,
    transaction: mocks.transaction,
  },
}));

import { setupRootAccount } from "./setup-root-account";

describe("setupRootAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.select.mockReturnValue({ from: mocks.selectFrom });
    mocks.selectFrom.mockReturnValue({ where: mocks.selectWhere });
    mocks.selectWhere.mockReturnValue({ limit: mocks.selectLimit });

    mocks.insert.mockReturnValue({ values: mocks.insertValues });
    mocks.insertValues.mockReturnValue({ returning: mocks.insertReturning });

    mocks.update.mockReturnValue({ set: mocks.updateSet });
    mocks.updateSet.mockReturnValue({ where: mocks.updateWhere });
    mocks.updateWhere.mockResolvedValue(undefined);

    mocks.transaction.mockImplementation(async (callback: (tx: { insert: typeof mocks.insert; update: typeof mocks.update }) => Promise<unknown>) => {
      return await callback({
        insert: mocks.insert,
        update: mocks.update,
      });
    });
  });

  it("should create root account, ghost profile, and set activeProfileId", async () => {
    mocks.selectLimit.mockResolvedValue([]);
    mocks.insertReturning
      .mockResolvedValueOnce([{ id: "root-1" }])
      .mockResolvedValueOnce([{ id: "profile-1" }]);

    const result = await setupRootAccount("user-1");

    expect(result).toEqual({
      success: true,
      rootAccountId: "root-1",
      ghostMaskProfileId: "profile-1",
    });

    expect(mocks.transaction).toHaveBeenCalledTimes(1);

    expect(mocks.insertValues).toHaveBeenNthCalledWith(1, {
      authUserId: "user-1",
      trustDays: 0,
    });

    expect(mocks.insertValues).toHaveBeenNthCalledWith(2, {
      rootAccountId: "root-1",
      displayName: "幽霊の仮面",
      purpose: "観測者プロフィール",
      roleType: "member",
      isActive: true,
      maskCategory: "ghost",
      isDefault: true,
      profileFormat: "profile",
      role: "guest",
      purposes: [],
      profileType: "system",
      points: 0,
      level: 1,
    });

    expect(mocks.updateSet).toHaveBeenCalledWith({
      activeProfileId: "profile-1",
    });
    expect(mocks.updateWhere).toHaveBeenCalledTimes(1);
  });

  it("should return already exists when root account exists", async () => {
    mocks.selectLimit.mockResolvedValue([{ id: "root-existing" }]);

    const result = await setupRootAccount("user-existing");

    expect(result.success).toBe(false);
    expect(result.message).toContain("already exists");
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("should return validation error when userId is empty", async () => {
    const result = await setupRootAccount("");

    expect(result).toEqual({
      success: false,
      message: "userId is required",
    });
    expect(mocks.select).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
