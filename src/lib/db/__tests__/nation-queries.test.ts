import { beforeEach, describe, expect, it, vi } from "vitest";

// ✅ vi.hoisted() を使用してモック変数をホイスト
const { insertMock, selectMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  selectMock: vi.fn(),
}));

vi.mock("../client", () => ({
  db: {
    insert: insertMock,
    select: selectMock,
  },
}));

import { createNation, getNationsByGroup } from "../nation-queries";

describe("nation-queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createNation: group_leader なら作成できる", async () => {
    const limit = vi.fn().mockResolvedValue([{ groupId: "group-1" }]);
    const whereLeader = vi.fn().mockReturnValue({ limit });
    const fromLeader = vi.fn().mockReturnValue({ where: whereLeader });

    const returning = vi.fn().mockResolvedValue([
      {
        id: "nation-1",
        name: "Nation One",
        description: "desc",
        ownerUserId: "profile-1",
        ownerGroupId: "group-1",
        createdAt: "2026-03-01T00:00:00.000Z",
      },
    ]);
    const valuesFirst = vi.fn().mockReturnValue({ returning });

    const onConflictDoNothing = vi.fn().mockResolvedValue(undefined);
    const valuesSecond = vi.fn().mockReturnValue({ onConflictDoNothing });

    selectMock.mockReturnValueOnce({ from: fromLeader });
    insertMock
      .mockReturnValueOnce({ values: valuesFirst })
      .mockReturnValueOnce({ values: valuesSecond });

    const result = await createNation("profile-1", "Nation One", "desc");

    expect(result.id).toBe("nation-1");
    expect(result.ownerGroupId).toBe("group-1");
  });

  it("createNation: group_leader でない場合は拒否", async () => {
    const limit = vi.fn().mockResolvedValue([]);
    const whereLeader = vi.fn().mockReturnValue({ limit });
    const fromLeader = vi.fn().mockReturnValue({ where: whereLeader });

    selectMock.mockReturnValueOnce({ from: fromLeader });

    await expect(createNation("profile-2", "Nation NG", "desc")).rejects.toThrow(
      "Forbidden: group_leader role is required",
    );
  });

  it("getNationsByGroup: 所属国一覧を返す", async () => {
    const orderBy = vi.fn().mockResolvedValue([
      {
        id: "nation-1",
        name: "Nation One",
        description: "desc",
        ownerUserId: "profile-1",
        ownerGroupId: "group-1",
        role: "deputy",
        joinedAt: "2026-03-01T00:00:00.000Z",
      },
    ]);
    const where = vi.fn().mockReturnValue({ orderBy });
    const innerJoin = vi.fn().mockReturnValue({ where });
    const from = vi.fn().mockReturnValue({ innerJoin });

    selectMock.mockReturnValue({ from });

    const rows = await getNationsByGroup("group-1");

    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe("nation-1");
  });
});
