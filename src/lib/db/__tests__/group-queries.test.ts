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

import { createGroup, getGroupsByUser } from "../group-queries";

describe("group-queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createGroup: グループ作成とleader参加を行う", async () => {
    const returning = vi.fn().mockResolvedValue([
      {
        id: "group-1",
        name: "Team One",
        description: "desc",
        leaderId: "profile-1",
        createdAt: "2026-03-01T00:00:00.000Z",
      },
    ]);
    const valuesFirst = vi.fn().mockReturnValue({ returning });

    const onConflictDoNothing = vi.fn().mockResolvedValue(undefined);
    const valuesSecond = vi.fn().mockReturnValue({ onConflictDoNothing });

    insertMock
      .mockReturnValueOnce({ values: valuesFirst })
      .mockReturnValueOnce({ values: valuesSecond });

    const result = await createGroup("profile-1", "Team One", "desc");

    expect(insertMock).toHaveBeenCalledTimes(2);
    expect(result.id).toBe("group-1");
    expect(result.role).toBe("leader");
  });

  it("getGroupsByUser: 所属グループ一覧を返す", async () => {
    const orderBy = vi.fn().mockResolvedValue([
      {
        id: "group-1",
        name: "Team One",
        description: "desc",
        leaderId: "profile-1",
        role: "leader",
        joinedAt: "2026-03-01T00:00:00.000Z",
      },
    ]);
    const where = vi.fn().mockReturnValue({ orderBy });
    const innerJoin = vi.fn().mockReturnValue({ where });
    const from = vi.fn().mockReturnValue({ innerJoin });

    selectMock.mockReturnValue({ from });

    const rows = await getGroupsByUser("profile-1");

    expect(selectMock).toHaveBeenCalledTimes(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("Team One");
  });
});
