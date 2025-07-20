import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockQueryBuilder - 拡張エラーハンドリングテスト", () => {
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

  describe("基本的なエラーハンドリング", () => {
    it("execute メソッドのエラーを try/catch でハンドリングできる", async () => {
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

    it("single メソッドのエラーを try/catch でハンドリングできる", async () => {
      // モックでエラーを発生させるためのセットアップ
      const mockQueryBuilder = mockClient.from("users").select();
      const originalSingle = mockQueryBuilder.single;

      // single メソッドをモックしてエラーを投げるようにする
      mockQueryBuilder.single = vi
        .fn()
        .mockRejectedValue(new Error("single メソッドエラー"));

      try {
        await mockQueryBuilder.single();
        // ここには到達しないはず
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("single メソッドエラー");
      }

      // モックを元に戻す
      mockQueryBuilder.single = originalSingle;
    });
  });

  describe("Promise ベースのエラーハンドリング", () => {
    it("Promise.catch でエラーをハンドリングできる", () => {
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

    it("Promise.finally は成功時もエラー時も実行される", async () => {
      const finallyMock = vi.fn();

      // 成功するケース
      await mockClient.from("users").select().execute().finally(finallyMock);

      expect(finallyMock).toHaveBeenCalledTimes(1);
      finallyMock.mockClear();

      // 失敗するケース
      const mockQueryBuilder = mockClient.from("users").select();
      const originalExecute = mockQueryBuilder.execute;
      mockQueryBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("テスト用エラー"));

      try {
        await mockQueryBuilder.execute().finally(finallyMock);
      } catch (error) {
        // エラーは無視
      }

      expect(finallyMock).toHaveBeenCalledTimes(1);

      // モックを元に戻す
      mockQueryBuilder.execute = originalExecute;
    });
  });

  describe("複雑なエラーシナリオ", () => {
    it("Promise.allSettled で成功と失敗の両方を処理できる", async () => {
      // 成功するクエリ
      const successQuery = mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .execute();

      // 失敗するクエリ
      const mockQueryBuilder = mockClient.from("users").select();
      const originalExecute = mockQueryBuilder.execute;
      mockQueryBuilder.execute = vi
        .fn()
        .mockRejectedValue(new Error("テスト用エラー"));
      const failQuery = mockQueryBuilder.execute();

      const results = await Promise.allSettled([successQuery, failQuery]);

      expect(results[0].status).toBe("fulfilled");
      if (results[0].status === "fulfilled") {
        expect(results[0].value.data[0].id).toBe(1);
      }

      expect(results[1].status).toBe("rejected");
      if (results[1].status === "rejected") {
        expect(results[1].reason.message).toBe("テスト用エラー");
      }

      // モックを元に戻す
      mockQueryBuilder.execute = originalExecute;
    });

    it("非同期関数内でのエラーハンドリング", async () => {
      // 非同期関数内でのエラーハンドリングをテスト
      async function fetchUserData(id: number) {
        try {
          const result = await mockClient
            .from("users")
            .select()
            .eq("id", id)
            .single();

          if (result.data === null) {
            throw new Error(`ユーザーID ${id} が見つかりません`);
          }

          return result.data;
        } catch (error) {
          console.error("ユーザーデータの取得中にエラーが発生しました:", error);
          throw error; // エラーを再スロー
        }
      }

      // 存在するユーザーの場合
      const user = await fetchUserData(1);
      expect(user.id).toBe(1);

      // 存在しないユーザーの場合
      try {
        await fetchUserData(999);
        // ここには到達しないはず
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(
          "ユーザーID 999 が見つかりません",
        );
      }
    });
  });
});
