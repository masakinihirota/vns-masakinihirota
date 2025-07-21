import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createMockSupabaseClient } from "./supabase-enhanced-client";
import { mockUser, mockSession } from "./sase-auth";

describe("Supabaseクライアントモック", () => {
  let supabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    supabase = createMockSupabaseClient();
    // テスト用のデータをセット
    supabase._setMockData("profiles", [
      {
        id: "1",
        user_id: "test-user-id",
        username: "testuser",
        bio: "テストユーザーです",
      },
      {
        id: "2",
        user_id: "other-user-id",
        username: "otheruser",
        bio: "別のユーザーです",
      },
    ]);

    supabase._setMockData("works", [
      {
        id: "1",
        user_id: "test-user-id",
        title: "作品1",
        description: "説明1",
      },
      {
        id: "2",
        user_id: "test-user-id",
        title: "作品2",
        description: "説明2",
      },
      {
        id: "3",
        user_id: "other-user-id",
        title: "作品3",
        description: "説明3",
      },
    ]);
  });

  afterEach(() => {
    supabase._clearMockData();
  });

  describe("認証機能", () => {
    it("正しい認証情報でログインできること", async () => {
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.error).toBeNull();
      expect(result.data.user).toEqual(mockUser);
      expect(result.data.session).toBeDefined();
    });

    it("不正な認証情報でログインできないこと", async () => {
      const result = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(result.error).toBeDefined();
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it("ログアウトできること", async () => {
      // まずログイン
      await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123",
      });

      // ログアウト
      const result = await supabase.auth.signOut();
      expect(result.error).toBeNull();

      // セッションが削除されていることを確認
      const session = await supabase.auth.getSession();
      expect(session.data.session).toBeNull();
    });
  });

  describe("データベース操作", () => {
    it("データを取得できること", async () => {
      const result = await supabase.from("profiles").select().execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(2);
      expect(result.data[0].username).toBe("testuser");
    });

    it("フィルタリングしてデータを取得できること", async () => {
      const result = await supabase
        .from("profiles")
        .select()
        .eq("user_id", "test-user-id")
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].username).toBe("testuser");
    });

    it("データを挿入できること", async () => {
      const newProfile = {
        id: "3",
        user_id: "new-user-id",
        username: "newuser",
        bio: "新しいユーザーです",
      };

      const result = await supabase
        .from("profiles")
        .insert(newProfile)
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toEqual(newProfile);

      // データが実際に追加されたか確認
      const allProfiles = await supabase.from("profiles").select().execute();
      expect(allProfiles.data).toHaveLength(3);
    });

    it("データを更新できること", async () => {
      const result = await supabase
        .from("profiles")
        .update({ bio: "更新されたバイオ" })
        .eq("user_id", "test-user-id")
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].bio).toBe("更新されたバイオ");

      // データが実際に更新されたか確認
      const profile = await supabase
        .from("profiles")
        .select()
        .eq("user_id", "test-user-id")
        .single();

      expect(profile.data.bio).toBe("更新されたバイオ");
    });

    it("データを削除できること", async () => {
      const result = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", "test-user-id")
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);

      // データが実際に削除されたか確認
      const allProfiles = await supabase.from("profiles").select().execute();
      expect(allProfiles.data).toHaveLength(1);
      expect(allProfiles.data[0].user_id).toBe("other-user-id");
    });
  });

  describe("高度なクエリ操作", () => {
    it("複数の条件でフィルタリングできること", async () => {
      const result = await supabase
        .from("works")
        .select()
        .eq("user_id", "test-user-id")
        .like("title", "%1%")
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe("作品1");
    });

    it("ソートしてデータを取得できること", async () => {
      const result = await supabase
        .from("works")
        .select()
        .order("title", { ascending: false })
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(3);
      expect(result.data[0].title).toBe("作品3");
    });

    it("特定のカラムのみ選択できること", async () => {
      const result = await supabase
        .from("works")
        .select(["id", "title"])
        .execute();

      expect(result.error).toBeNull();
      expect(result.data).toHaveLength(3);
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("title");
      expect(result.data[0]).not.toHaveProperty("description");
    });

    it("レコード数をカウントできること", async () => {
      const result = await supabase
        .from("works")
        .select()
        .eq("user_id", "test-user-id")
        .count()
        .execute();

      expect(result.error).toBeNull();
      expect(result.data[0].count).toBe(2);
    });
  });
});
