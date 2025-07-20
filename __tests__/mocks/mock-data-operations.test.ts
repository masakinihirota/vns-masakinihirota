import { describe, it, expect, beforeEach } from "vitest";
import { createMockSupabaseClient } from "./supabase";

describe("MockDatabase - データ操作テスト", () => {
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

  describe("insert 操作のテスト", () => {
    it("単一レコードの挿入が Promise ベースで動作する", async () => {
      const newUser = {
        id: 3,
        name: "Charlie Brown",
        email: "charlie@example.com",
        age: 35,
        status: "active",
      };

      const promise = mockClient.from("users").insert(newUser).execute();

      expect(promise).toBeInstanceOf(Promise);

      const result = await promise;
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(newUser);

      // データが実際に追加されたことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(3);
      expect(allUsers.find((user) => user.id === 3)).toEqual(newUser);
    });

    it("複数レコードの挿入が動作する", async () => {
      const newUsers = [
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
      ];

      const result = await mockClient.from("users").insert(newUsers).execute();

      expect(result.data).toHaveLength(2);
      expect(result.data).toEqual(newUsers);

      // データが実際に追加されたことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(4);
      expect(allUsers.some((user) => user.id === 3)).toBe(true);
      expect(allUsers.some((user) => user.id === 4)).toBe(true);
    });

    it("存在しないテーブルへの挿入で新しいテーブルが作成される", async () => {
      const newProduct = { id: 1, name: "Product 1", price: 100 };

      const result = await mockClient
        .from("products")
        .insert(newProduct)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(newProduct);

      // 新しいテーブルが作成されたことを確認
      const products = mockClient._getMockData("products");
      expect(products).toHaveLength(1);
      expect(products[0]).toEqual(newProduct);
    });
  });

  describe("update 操作のテスト", () => {
    it("フィルタに一致するレコードが更新される", async () => {
      const result = await mockClient
        .from("users")
        .update({ status: "updated", age: 31 })
        .eq("id", 2)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(2);
      expect(result.data[0].status).toBe("updated");
      expect(result.data[0].age).toBe(31);

      // データが実際に更新されたことを確認
      const allUsers = mockClient._getMockData("users");
      const updatedUser = allUsers.find((user) => user.id === 2);
      expect(updatedUser?.status).toBe("updated");
      expect(updatedUser?.age).toBe(31);
    });

    it("複数のフィルタ条件を組み合わせて更新できる", async () => {
      const result = await mockClient
        .from("users")
        .update({ status: "premium" })
        .eq("status", "active")
        .eq("age", 25)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(1);
      expect(result.data[0].status).toBe("premium");

      // データが実際に更新されたことを確認
      const allUsers = mockClient._getMockData("users");
      const updatedUser = allUsers.find((user) => user.id === 1);
      expect(updatedUser?.status).toBe("premium");
    });

    it("条件に一致するレコードがない場合は空配列を返す", async () => {
      const result = await mockClient
        .from("users")
        .update({ status: "updated" })
        .eq("id", 999)
        .execute();

      expect(result.data).toHaveLength(0);

      // データが変更されていないことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(2);
      expect(allUsers[0].status).toBe("active");
      expect(allUsers[1].status).toBe("inactive");
    });
  });

  describe("delete 操作のテスト", () => {
    it("フィルタに一致するレコードが削除される", async () => {
      const result = await mockClient
        .from("users")
        .delete()
        .eq("id", 1)
        .execute();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(1);

      // データが実際に削除されたことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(1);
      expect(allUsers.find((user) => user.id === 1)).toBeUndefined();
    });

    it("複数のフィルタ条件を組み合わせて削除できる", async () => {
      // まず追加のユーザーを追加
      await mockClient
        .from("users")
        .insert([
          {
            id: 3,
            name: "Charlie",
            email: "charlie@example.com",
            age: 35,
            status: "active",
          },
          {
            id: 4,
            name: "David",
            email: "david@example.com",
            age: 40,
            status: "active",
          },
        ])
        .execute();

      const result = await mockClient
        .from("users")
        .delete()
        .eq("status", "active")
        .execute();

      expect(result.data).toHaveLength(3); // Alice, Charlie, David

      // active ステータスのユーザーが削除されたことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0].status).toBe("inactive");
    });

    it("条件に一致するレコードがない場合は空配列を返す", async () => {
      const result = await mockClient
        .from("users")
        .delete()
        .eq("id", 999)
        .execute();

      expect(result.data).toHaveLength(0);

      // データが変更されていないことを確認
      const allUsers = mockClient._getMockData("users");
      expect(allUsers).toHaveLength(2);
    });
  });
});
