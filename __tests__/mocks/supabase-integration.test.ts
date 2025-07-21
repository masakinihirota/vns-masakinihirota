import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createMockSupabaseCent } from "./supabase-enhanced-client";
import { setupTestData } from "./index";

describe("Supabase統合テスト", () => {
  let supabase: ReturnType<typeof createMockSupabaseClient>;

  beforeEach(() => {
    supabase = createMockSupabaseClient();
    // テストデータをセットアップ
    setupTestData(supabase);

    // 認証状態をセット
    supabase._setAuthState({
      user: {
        id: "test-user-id",
        email: "test@example.com",
        aud: "authenticated",
        role: "authenticated",
        email_confirmed_at: "2024-01-01T00:00:00.000Z",
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z",
      },
      session: {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: "bearer",
        user: {
          id: "test-user-id",
          email: "test@example.com",
          aud: "authenticated",
          role: "authenticated",
          email_confirmed_at: "2024-01-01T00:00:00.000Z",
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
      },
    });
  });

  afterEach(() => {
    supabase._clearMockData();
  });

  describe("認証とデータベース統合", () => {
    it("認証済みユーザーの自分のプロフィールを取得できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // 自分のプロフィールを取得
      const { data: profile, error } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", session!.user.id)
        .single();

      expect(error).toBeNull();
      expect(profile).not.toBeNull();
      expect(profile.user_id).toBe("test-user-id");
      expect(profile.username).toBe("testuser");
    });

    it("認証済みユーザーの作品一覧を取得できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // 自分の作品一覧を取得
      const { data: works, error } = await supabase
        .from("works")
        .select()
        .eq("user_id", session!.user.id)
        .order("created_at", { ascending: false });

      expect(error).toBeNull();
      expect(works).toHaveLength(2);
      expect(works[0].user_id).toBe("test-user-id");
    });

    it("新しい作品を作成できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // 新しい作品を作成
      const newWork = {
        id: "4",
        user_id: session!.user.id,
        title: "新しいテスト作品",
        description: "新しく作成したテスト作品です",
        image_url: "https://example.com/new-work.png",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: insertedWork, error } = await supabase
        .from("works")
        .insert(newWork)
        .select()
        .single();

      expect(error).toBeNull();
      expect(insertedWork).toEqual(newWork);

      // 作品が追加されたことを確認
      const { data: works } = await supabase
        .from("works")
        .select()
        .eq("user_id", session!.user.id);

      expect(works).toHaveLength(3);
    });
  });

  describe("RPC関数とデータベース統合", () => {
    it("ユーザー統計情報を取得できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // RPC関数を呼び出し
      const { data: stats, error } = await supabase
        .rpc("get_user_stats", { user_id: session!.user.id })
        .execute();

      expect(error).toBeNull();
      expect(stats).toEqual({
        works_count: 2,
        skills_count: 3,
        groups_count: 2,
        followers_count: 10,
        following_count: 5,
      });
    });

    it("ユーザー検索ができること", async () => {
      // RPC関数を呼び出し
      const { data: searchResults, error } = await supabase
        .rpc("search_users", { query: "テスト" })
        .execute();

      expect(error).toBeNull();
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].display_name).toBe("テストユーザー");
    });
  });

  describe("複雑なクエリ操作", () => {
    it("ユーザーのスキルを取得し、レベルでソートできること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // スキルを取得してレベルでソート
      const { data: skills, error } = await supabase
        .from("skills")
        .select()
        .eq("user_id", session!.user.id)
        .order("level", { ascending: false });

      expect(error).toBeNull();
      expect(skills).toHaveLength(3);
      expect(skills[0].name).toBe("JavaScript");
      expect(skills[0].level).toBe(5);
    });

    it("ユーザーが所属するグループを取得できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // グループメンバーからユーザーのグループIDを取得
      const { data: groupMembers } = await supabase
        .from("group_members")
        .select()
        .eq("user_id", session!.user.id);

      expect(groupMembers).toHaveLength(2);

      // グループIDからグループ情報を取得
      const groupIds = groupMembers.map((member) => member.group_id);
      const { data: groups } = await supabase
        .from("groups")
        .select()
        .in("id", groupIds);

      expect(groups).toHaveLength(2);
      expect(groups[0].name).toBe("テストグループ1");
    });

    it("未読の通知を取得できること", async () => {
      // 認証状態を確認
      const {
        data: { session },
      } = await supabase.auth.getSession();
      expect(session).not.toBeNull();

      // 未読の通知を取得
      const { data: notifications } = await supabase
        .from("notifications")
        .select()
        .eq("user_id", session!.user.id)
        .eq("read", false);

      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe("message");
    });
  });
});
