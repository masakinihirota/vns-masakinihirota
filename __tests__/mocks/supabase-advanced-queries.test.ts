import { describe, it, expect, beforeEach } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockQueryBuilder - 高度なクエリ操作", () => {
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

  describe("like メソッド", () => {
    it("部分一致検索が正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .like("name", "%John%")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Alice Johnson");
    });

    it("前方一致検索が正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .like("name", "Bob%")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Bob Smith");
    });

    it("後方一致検索が正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .like("email", "%@example.com")
        .execute();

      expect(result.data).toHaveLength(5);
    });

    it("大文字小文字を区別しない検索が動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .like("name", "%ALICE%")
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Alice Johnson");
    });
  });

  describe("in メソッド", () => {
    it("複数の値での検索が正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .in("status", ["active", "pending"])
        .execute();

      expect(result.data).toHaveLength(4);
      expect(
        result.data.every((user) =>
          ["active", "pending"].includes(user.status),
        ),
      ).toBe(true);
    });

    it("数値の配列での検索が正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .in("id", [1, 3, 5])
        .execute();

      expect(result.data).toHaveLength(3);
      expect(result.data.map((user) => user.id)).toEqual([1, 3, 5]);
    });

    it("空の配列では結果が0件になる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .in("status", [])
        .execute();

      expect(result.data).toHaveLength(0);
    });
  });

  describe("order メソッド", () => {
    it("昇順ソートが正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("age", { ascending: true })
        .execute();

      expect(result.data).toHaveLength(5);
      expect(result.data[0].age).toBe(25);
      expect(result.data[4].age).toBe(35);
    });

    it("降順ソートが正しく動作する", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("age", { ascending: false })
        .execute();

      expect(result.data).toHaveLength(5);
      expect(result.data[0].age).toBe(35);
      expect(result.data[4].age).toBe(25);
    });

    it("デフォルトで昇順ソートになる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("name")
        .execute();

      expect(result.data).toHaveLength(5);
      expect(result.data[0].name).toBe("Alice Johnson");
      expect(result.data[4].name).toBe("Eve Davis");
    });
  });

  describe("limit メソッド", () => {
    it("指定した件数で制限される", async () => {
      const result = await mockClient.from("users").select().limit(3).execute();

      expect(result.data).toHaveLength(3);
    });

    it("データ件数より大きな値を指定しても全件取得される", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .limit(10)
        .execute();

      expect(result.data).toHaveLength(5);
    });
  });

  describe("range メソッド", () => {
    it("指定した範囲のデータが取得される", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("id")
        .range(1, 3)
        .execute();

      expect(result.data).toHaveLength(3);
      expect(result.data[0].id).toBe(2);
      expect(result.data[2].id).toBe(4);
    });

    it("範囲の開始位置が0の場合", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("id")
        .range(0, 2)
        .execute();

      expect(result.data).toHaveLength(3);
      expect(result.data[0].id).toBe(1);
      expect(result.data[2].id).toBe(3);
    });
  });

  describe("メソッドチェーン", () => {
    it("複数のフィルタを組み合わせて使用できる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .gt("age", 25)
        .order("age")
        .limit(2)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(
        result.data.every((user) => user.status === "active" && user.age > 25),
      ).toBe(true);
      expect(result.data[0].age).toBeLessThanOrEqual(result.data[1].age);
    });

    it("like と in を組み合わせて使用できる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .like("name", "%e%")
        .in("status", ["active", "inactive"])
        .order("name")
        .execute();

      expect(result.data.length).toBeGreaterThan(0);
      expect(
        result.data.every(
          (user) =>
            user.name.toLowerCase().includes("e") &&
            ["active", "inactive"].includes(user.status),
        ),
      ).toBe(true);
    });

    it("range と limit を組み合わせた場合、rangeが優先される", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .order("id")
        .range(1, 2)
        .limit(10)
        .execute();

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe(2);
      expect(result.data[1].id).toBe(3);
    });
  });

  describe("single メソッドとの組み合わせ", () => {
    it("フィルタ後の最初の1件を取得できる", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "active")
        .order("age")
        .single();

      expect(result.data).not.toBeNull();
      expect(result.data?.status).toBe("active");
      expect(result.data?.age).toBe(25); // 最年少のactiveユーザー
    });

    it("条件に一致するデータがない場合はnullが返される", async () => {
      const result = await mockClient
        .from("users")
        .select()
        .eq("status", "deleted")
        .single();

      expect(result.data).toBeNull();
    });
  });
});
