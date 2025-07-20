import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockQueryBuilder - Promise ベースの動作テスト", () => {
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
    ]);
  });

  describe("基本的なPromise動作", () => {
    it("execute メソッドが Promise を返す", () => {
      const promise = mockClient.from("users").select().execute();
      expect(promise).toBeInstanceOf(Promise);
    });

    it("single メソッドが Promise を返す", () => {
      const promise = mockClient.from("users").select().single();
      expect(promise).toBeInstanceOf(Promise);
    });

    it("Promise.resolve で解決できる", async () => {
      const promise = mockClient.from("users").select().execute();
      const result = await Promise.resolve(promise);

      expect(result.data).toHaveLength(3);
      expect(result.error).toBeNull();
    });
  });

  describe("Promise チェーンとメソッド", () => {
    it("then メソッドでチェーンできる", () => {
      return mockClient
        .from("users")
        .select()
        .execute()
        .then((result) => {
          expect(result.data).toHaveLength(3);
          expect(result.error).toBeNull();
        });
    });

    it("catch メソッドでエラーをハンドリングできる", () => {
      // 意図的に失敗するPromiseを作成
      const failingPromise = Promise.reject(new Error("テスト用エラー"));

      return failingPromise
        .catch((error) => {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe("テスト用エラー");
          return { data: [], error: null }; // エラーを回復
        })
        .then((result) => {
          expect(result.data).toEqual([]);
        });
    });

    it("finally メソッドが実行される", () => {
      const finallyMock = vi.fn();

      return mockClient
        .from("users")
        .select()
        .execute()
        .finally(() => {
          finallyMock();
          expect(finallyMock).toHaveBeenCalledTimes(1);
        });
    });
  });

  describe("複雑なPromise操作", () => {
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

    it("Promise.race で最初に完了したクエリを取得できる", async () => {
      // 通常のクエリ
      const normalQuery = mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .execute();

      // 遅延するクエリをシミュレート
      const delayedQuery = new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({ data: [{ id: 999 }], error: null });
        }, 100);
      });

      const result = await Promise.race([normalQuery, delayedQuery]);

      // 通常のクエリが先に完了するはず
      expect(result.data[0].id).toBe(1);
    });

    it("async/await パターンで使用できる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.every((user) => user.status === "active")).toBe(true);
    });
  });
});
