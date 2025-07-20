import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockQueryBuilder", () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    mockClient._clearMockData();

    // テスト用のサンプルデータを設定
    mockClient._setMockData("users", [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 25,
        status: "active",
      },
      {
        id: 2,
        name: "Bob Smith",
        email: "bob@example.com",
        age: 30,
        status: "inactive",
      },
      {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        age: 35,
        status: "active",
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david@example.com",
        age: 28,
        status: "pending",
      },
      {
        id: 5,
        name: "Eve Davis",
        email: "eve@example.com",
        age: 32,
        status: "active",
      },
    ]);
  });

  describe("Promise ベースの動作テスト", () => {
    it("execute メソッドが Promise を返す", () => {
      const promise = mockClient.from("users").select().execute();

      expect(promise).toBeInstanceOf(Promise);
    });

    it("async/await パターンで使用できる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(1);
    });

    it("Promise チェーンで使用できる", () => {
      return mockClient
        .from("users")
        .select()
        .eq("id", 2)
        .execute()
        .then((result) => {
          expect(result.data).toHaveLength(1);
          expect(result.data[0].id).toBe(2);
        });
    });

    it("Promise.all で複数のクエリを並行実行できる", async () => {
      const promises = [
        mockClient.from("users").select().eq("id", 1).execute(),
        mockClient.from("users").select().eq("id", 2).execute(),
        mockClient.from("users").select().eq("id", 3).execute(),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results[0].data[0].id).toBe(1);
      expect(results[1].data[0].id).toBe(2);
      expect(results[2].data[0].id).toBe(3);
    });
  });

  describe("エラーハンドリングのテスト", () => {
    it("存在しないテーブルに対するクエリは空の配列を返す", async () => {
      const result = await mockClient
        .from("non_existent_table")
        .select()
        .execute();

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it("存在しないテーブルに対する single クエリは null を返す", async () => {
      const result = await mockClient
        .from("non_existent_table")
        .select()
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });

    it("try/catch ブロックでエラーをハンドリングできる", async () => {
      // モックでエラーを発生させるためのセットアップ
      const mockQueryBuilder = mockClient.from("users").select();
      const originalExecute = mockQueryBuilder.execute;

      // execute メソッドをモックしてエラーを投げるようにする
      mockQueryBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("テスト用エラー"));

      try {
        await mockQueryBuilder.execute();
        // ここには到達しないはず
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("テスト用エラー");
      }

      // モックを元に戻す
      mockQueryBuilder.execute = originalExecute;
    });
  });

  describe("複雑なクエリの組み合わせテスト", () => {
    it("複数のフィルタと並び替えを組み合わせたクエリが正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .gte("age", 25)
        .in("status", ["active", "pending"])
        .order("age", { ascending: false })
        .execute();

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.every((user) => user.age >= 25)).toBe(true);
      expect(
        result.data.every((user) =>
          ["active", "pending"].includes(user.status),
        ),
      ).toBe(true);

      // 年齢の降順になっていることを確認
      for (let i = 0; i < result.data.length - 1; i++) {
        expect(result.data[i].age).toBeGreaterThanOrEqual(
          result.data[i + 1].age,
        );
      }
    });

    it("フィルタ、ソート、limit を組み合わせたクエリが正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .neq("status", "inactive")
        .order("name")
        .limit(2)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.every((user) => user.status !== "inactive")).toBe(
        true,
      );

      // 名前順になっていることを確認
      expect(
        result.data[0].name.localeCompare(result.data[1].name),
      ).toBeLessThan(0);
    });
  });
});
