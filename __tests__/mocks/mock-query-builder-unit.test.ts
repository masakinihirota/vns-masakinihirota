import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockQueryBuilder - 単体テスト", () => {
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

  describe("基本的なメソッドテスト", () => {
    it("select メソッドが MockQueryBuilder インスタンスを返す", () => {
      const queryBuilder = mockClient.from("users").select();

      // インスタンスが正しいメソッドを持っていることを確認
      expect(queryBuilder).toHaveProperty("eq");
      expect(queryBuilder).toHaveProperty("neq");
      expect(queryBuilder).toHaveProperty("gt");
      expect(queryBuilder).toHaveProperty("gte");
      expect(queryBuilder).toHaveProperty("lt");
      expect(queryBuilder).toHaveProperty("lte");
      expect(queryBuilder).toHaveProperty("like");
      expect(queryBuilder).toHaveProperty("in");
      expect(queryBuilder).toHaveProperty("order");
      expect(queryBuilder).toHaveProperty("limit");
      expect(queryBuilder).toHaveProperty("range");
      expect(queryBuilder).toHaveProperty("execute");
      expect(queryBuilder).toHaveProperty("single");
    });

    it("フィルタメソッドが自身のインスタンスを返す（メソッドチェーン）", () => {
      const queryBuilder = mockClient.from("users").select();

      // 各メソッドが自身のインスタンスを返すことを確認
      expect(queryBuilder.eq("id", 1)).toBe(queryBuilder);
      expect(queryBuilder.neq("status", "inactive")).toBe(queryBuilder);
      expect(queryBuilder.gt("age", 20)).toBe(queryBuilder);
      expect(queryBuilder.gte("age", 25)).toBe(queryBuilder);
      expect(queryBuilder.lt("age", 40)).toBe(queryBuilder);
      expect(queryBuilder.lte("age", 35)).toBe(queryBuilder);
      expect(queryBuilder.like("name", "%Alice%")).toBe(queryBuilder);
      expect(queryBuilder.in("status", ["active", "pending"])).toBe(
        queryBuilder,
      );
      expect(queryBuilder.order("name")).toBe(queryBuilder);
      expect(queryBuilder.limit(10)).toBe(queryBuilder);
      expect(queryBuilder.range(0, 5)).toBe(queryBuilder);
    });
  });

  describe("execute メソッドのテスト", () => {
    it("execute メソッドが Promise<SupabaseResponse> を返す", async () => {
      const result = await mockClient.from("users").select().execute();

      // 結果の構造を確認
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.error).toBeNull();
    });

    it("フィルタが適用された結果を返す", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.every((user) => user.status === "active")).toBe(true);
    });

    it("複数のフィルタが AND 条件で適用される", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .gt("age", 30)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Charlie Brown");
    });
  });

  describe("single メソッドのテスト", () => {
    it("single メソッドが Promise<SupabaseResponse> を返す", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("id", 1)
        .single();

      // 結果の構造を確認
      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("error");
      expect(result.error).toBeNull();
    });

    it("条件に一致する最初のレコードを返す", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .single();

      expect(result.data).not.toBeNull();
      expect(result.data?.status).toBe("active");
      // 最初のアクティブユーザーはAlice
      expect(result.data?.name).toBe("Alice Johnson");
    });

    it("条件に一致するレコードがない場合は null を返す", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "deleted")
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });
  });
});
