import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockDatabase - エラーハンドリングテスト", () => {
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
    ]);
  });

  describe("エッジケースのテスト", () => {
    it("空のテーブルに対するクエリは空の配列を返す", async () => {
      mockClient._setMockData("empty_table", []);

      const result = await mockClient.from("empty_table").select().execute();

      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it("存在しないカラムでのフィルタリングは undefined との比較になる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("non_existent_column", "value")
        .execute();

      expect(result.data).toHaveLength(0);
    });

    it("null 値でのフィルタリングが正しく動作する", async () => {
      // null 値を持つユーザーを追加
      await mockClient
        .from("users")
        .insert({
          id: 3,
          name: "Charlie",
          email: null,
          age: 35,
          status: "active",
        })
        .execute();

      const result = await mockClient
        .from("users")
        .select()
        .eq("email", null)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(3);
    });

    it("複数の条件が矛盾する場合は空の結果を返す", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .eq("id", 2)
        .execute();

      expect(result.data).toHaveLength(0);
    });
  });

  describe("Promise エラーハンドリング", () => {
    it("Promise の catch で例外をハンドリングできる", () => {
      // モックでエラーを発生させるためのセットアップ
      const mockQueryBuilder = mockClient.from("users").select();
      const originalExecute = mockQueryBuilder.execute;

      // execute メソッドをモックしてエラーを投げるようにする
      mockQueryBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("テスト用エラー"));

      return mockQueryBuilder
        .execute()
        .then(() => {
          // ここには到達しないはず
          expect(true).toBe(false);
        })
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("テスト用エラー");

          // モックを元に戻す
          mockQueryBuilder.execute = originalExecute;
        });
    });

    it("async/await と try/catch でエラーをハンドリングできる", async () => {
      // モックでエラーを発生させるためのセットアップ
      const mockInsertBuilder = mockClient.from("users").insert({});
      const originalExecute = mockInsertBuilder.execute;

      // execute メソッドをモックしてエラーを投げるようにする
      mockInsertBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("挿入エラー"));

      try {
        await mockInsertBuilder.execute();
        // ここには到達しないはず
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("挿入エラー");
      }

      // モックを元に戻す
      mockInsertBuilder.execute = originalExecute;
    });
  });

  describe("複雑なエラーシナリオ", () => {
    it("複数の非同期操作でいずれかがエラーになった場合のハンドリング", async () => {
      const successPromise = mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .execute();

      // エラーを発生させるモック
      const mockQueryBuilder = mockClient.from("users").select();
      const originalExecute = mockQueryBuilder.execute;
      mockQueryBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("テスト用エラー"));
      const errorPromise = mockQueryBuilder.execute();

      // Promise.allSettled でエラーを含む複数のPromiseを処理
      const results = await Promise.allSettled([successPromise, errorPromise]);

      expect(results[0].status).toBe("fulfilled");
      if (results[0].status === "fulfilled") {
        expect(results[0].value.data).toHaveLength(1);
        expect(results[0].value.data[0].id).toBe(1);
      }

      expect(results[1].status).toBe("rejected");
      if (results[1].status === "rejected") {
        expect(results[1].reason.message).toBe("テスト用エラー");
      }

      // モックを元に戻す
      mockQueryBuilder.execute = originalExecute;
    });

    it("トランザクション的な操作のシミュレーション", async () => {
      try {
        // 最初の操作は成功
        await mockClient
          .from("users")
          .insert({
            id: 3,
            name: "Charlie",
            email: "charlie@example.com",
            age: 35,
            status: "active",
          })
          .execute();

        // 2番目の操作でエラーを発生させる
        const mockUpdateBuilder = mockClient
          .from("users")
          .update({})
          .eq("id", 3);
        const originalExecute = mockUpdateBuilder.execute;
        mockUpdateBuilder.execute = vi
          .fn()
          .mockRejectedValue(new Error("更新エラー"));

        await mockUpdateBuilder.execute();

        // ここには到達しないはず
        expect(true).toBe(false);
      } catch (error) {
        // エラーが発生したことを確認
        expect((error as Error).message).toBe("更新エラー");

        // 最初の操作は成功しているはず（ロールバックの概念はないため）
        const allUsers = mockClient._getMockData("users");
        expect(allUsers).toHaveLength(3);
        expect(allUsers.some((user) => user.id === 3)).toBe(true);
      }
    });
  });
});
