import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createMockSupabaseClient,
  createMockDatabase,
  mockAuthState,
  mockUser,
  mockSession,
} from "./supabase";

describe("Supabase Mock", () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>;
  let mockDb: ReturnType<typeof createMockDatabase>;

  beforeEach(() => {
    mockClient = createMockSupabaseClient();
    mockDb = createMockDatabase();
    mockClient._clearMockData();
    mockAuthState.signOut();
  });

  describe("MockQueryBuilder", () => {
    it("should execute basic select query", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
      ]);

      // クエリを実行
      const result = await mockClient.from("users").select().execute();

      expect(result.data).toHaveLength(2);
      expect(result.error).toBeNull();
      expect(result.data[0]).toEqual({ id: 1, name: "Alice", age: 25 });
    });

    it("should filter with eq method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
      ]);

      // eq フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .eq("name", "Alice")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({ id: 1, name: "Alice", age: 25 });
    });

    it("should filter with neq method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
      ]);

      // neq フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .neq("name", "Alice")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({ id: 2, name: "Bob", age: 30 });
    });

    it("should filter with gt method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ]);

      // gt フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .gt("age", 25)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Bob", "Charlie"]);
    });

    it("should filter with gte method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ]);

      // gte フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .gte("age", 30)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Bob", "Charlie"]);
    });

    it("should filter with lt method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ]);

      // lt フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .lt("age", 30)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({ id: 1, name: "Alice", age: 25 });
    });

    it("should filter with lte method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ]);

      // lte フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .lte("age", 30)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Alice", "Bob"]);
    });

    it("should return single record with single method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
      ]);

      // single メソッドを使用
      const result = await mockClient
        .from("users")
        .select()
        .eq("name", "Alice")
        .single();

      expect(result.data).toEqual({ id: 1, name: "Alice", age: 25 });
      expect(result.error).toBeNull();
    });

    it("should return null for single method when no match", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [{ id: 1, name: "Alice", age: 25 }]);

      // 存在しないデータを検索
      const result = await mockClient
        .from("users")
        .select()
        .eq("name", "NonExistent")
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
    });

    it("should chain multiple filters", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25, active: true },
        { id: 2, name: "Bob", age: 30, active: true },
        { id: 3, name: "Charlie", age: 35, active: false },
      ]);

      // 複数のフィルタをチェーン
      const result = await mockClient
        .from("users")
        .select()
        .gt("age", 25)
        .eq("active", true)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual({
        id: 2,
        name: "Bob",
        age: 30,
        active: true,
      });
    });

    it("should filter with like method - contains", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@test.com" },
        { id: 3, name: "Charlie", email: "charlie@example.org" },
      ]);

      // like フィルタを使用（部分一致）
      const result = await mockClient
        .from("users")
        .select()
        .like("email", "%example%")
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Alice", "Charlie"]);
    });

    it("should filter with like method - starts with", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@test.com" },
        { id: 3, name: "Charlie", email: "charlie@example.org" },
      ]);

      // like フィルタを使用（前方一致）
      const result = await mockClient
        .from("users")
        .select()
        .like("name", "A%")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Alice");
    });

    it("should filter with like method - ends with", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@test.com" },
        { id: 3, name: "Charlie", email: "charlie@example.org" },
      ]);

      // like フィルタを使用（後方一致）
      const result = await mockClient
        .from("users")
        .select()
        .like("email", "%org")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Charlie");
    });

    it("should filter with in method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" },
        { id: 3, name: "Charlie", role: "moderator" },
        { id: 4, name: "Dave", role: "user" },
      ]);

      // in フィルタを使用
      const result = await mockClient
        .from("users")
        .select()
        .in("role", ["admin", "moderator"])
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Alice", "Charlie"]);
    });

    it("should sort with order method - ascending", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 3, name: "Charlie", age: 35 },
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
      ]);

      // order メソッドを使用（昇順）
      const result = await mockClient
        .from("users")
        .select()
        .order("age", { ascending: true })
        .execute();

      expect(result.data.map((u) => u.name)).toEqual([
        "Alice",
        "Bob",
        "Charlie",
      ]);
    });

    it("should sort with order method - descending", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
      ]);

      // order メソッドを使用（降順）
      const result = await mockClient
        .from("users")
        .select()
        .order("age", { ascending: false })
        .execute();

      expect(result.data.map((u) => u.name)).toEqual([
        "Charlie",
        "Bob",
        "Alice",
      ]);
    });

    it("should limit results with limit method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
        { id: 4, name: "Dave", age: 40 },
      ]);

      // limit メソッドを使用
      const result = await mockClient.from("users").select().limit(2).execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Alice", "Bob"]);
    });

    it("should paginate results with range method", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25 },
        { id: 2, name: "Bob", age: 30 },
        { id: 3, name: "Charlie", age: 35 },
        { id: 4, name: "Dave", age: 40 },
        { id: 5, name: "Eve", age: 45 },
      ]);

      // range メソッドを使用
      const result = await mockClient
        .from("users")
        .select()
        .range(1, 3)
        .execute();

      expect(result.data).toHaveLength(3);
      expect(result.data.map((u) => u.name)).toEqual([
        "Bob",
        "Charlie",
        "Dave",
      ]);
    });

    it("should chain multiple advanced query methods", async () => {
      // テストデータを設定
      mockClient._setMockData("users", [
        { id: 1, name: "Alice", age: 25, role: "admin" },
        { id: 2, name: "Bob", age: 30, role: "user" },
        { id: 3, name: "Charlie", age: 35, role: "user" },
        { id: 4, name: "Dave", age: 40, role: "moderator" },
        { id: 5, name: "Eve", age: 45, role: "user" },
      ]);

      // 複数の高度なクエリメソッドをチェーン
      const result = await mockClient
        .from("users")
        .select()
        .in("role", ["user", "moderator"])
        .gt("age", 30)
        .order("age", { ascending: false })
        .limit(2)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data.map((u) => u.name)).toEqual(["Eve", "Dave"]);
    });
  });

  describe("Authentication Mock", () => {
    it("should handle user authentication", async () => {
      const result = await mockClient.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it("should handle authentication failure", async () => {
      const result = await mockClient.auth.signInWithPassword({
        email: "wrong@example.com",
        password: "wrongpassword",
      });

      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toBeTruthy();
      expect(result.error?.message).toBe("Invalid login credentials");
    });
  });
});
