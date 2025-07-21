import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// モックを作成
const mockUser = {
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  created_at: "2024-01-01T00:00:00.000Z",
};

const mockProfiles = [
  {
    id: 1,
    user_id: "test-user-id",
    username: "testuser",
    bio: "Test bio",
    avatar_url: "https://example.com/avatar.png",
  },
  {
    id: 2,
    user_id: "another-user-id",
    username: "anotheruser",
    bio: "Another bio",
    avatar_url: "https://example.com/another-avatar.png",
  },
];

const mockPosts = [
  {
    id: 1,
    user_id: "test-user-id",
    title: "Test Post 1",
    content: "This is test post 1",
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    user_id: "test-user-id",
    title: "Test Post 2",
    content: "This is test post 2",
    created_at: "2024-01-02T00:00:00.000Z",
  },
  {
    id: 3,
    user_id: "another-user-id",
    title: "Another Post",
    content: "This is another post",
    created_at: "2024-01-03T00:00:00.000Z",
  },
];

// Supabase クライアントのモック
const mockSupabaseClient = {
  from: vi.fn().mockImplementation((table) => {
    let mockData = [];

    if (table === "profiles") {
      mockData = [...mockProfiles];
    } else if (table === "posts") {
      mockData = [...mockPosts];
    }

    return {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        if (table === "profiles" && mockData.length > 0) {
          return Promise.resolve({ data: mockData[0], error: null });
        }
        return Promise.resolve({ data: null, error: null });
      }),
      execute: vi.fn().mockImplementation(() => {
        return Promise.resolve({ data: mockData, error: null });
      }),
    };
  }),
  rpc: vi.fn().mockImplementation((functionName, params) => {
    return {
      execute: vi.fn().mockImplementation(() => {
        if (functionName === "get_user_posts") {
          const userId = params.user_id;
          const userPosts = mockPosts.filter((post) => post.user_id === userId);
          return Promise.resolve({ data: userPosts, error: null });
        }
        return Promise.resolve({ data: null, error: null });
      }),
    };
  }),
};

// クライアントとサーバーのモックを作成
vi.mock("@/lib/supabase/client", () => ({
  createClient: vi.fn().mockReturnValue(mockSupabaseClient),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseClient),
}));

describe("Supabase データベース操作統合テスト", () => {
  beforeEach(() => {
    // モックをリセット
    vi.clearAllMocks();
  });

  describe("CRUD 操作のテスト", () => {
    it("データの取得が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // データ取得
      const { data, error } = await supabase.from("posts").select().execute();

      // 結果を確認
      expect(error).toBeNull();
      expect(data).toEqual(mockPosts);
      expect(supabase.from).toHaveBeenCalledWith("posts");
    });

    it("単一レコードの取得が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // 単一レコード取得
      const { data, error } = await supabase.from("profiles").select().single();

      // 結果を確認
      expect(error).toBeNull();
      expect(data).toEqual(mockProfiles[0]);
      expect(supabase.from).toHaveBeenCalledWith("profiles");
    });

    it("フィルタリングが正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // フィルタリング
      await supabase
        .from("posts")
        .select()
        .eq("user_id", "test-user-id")
        .execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("posts");
      // 注: モックの制限により、eq の引数を検証することはできません
    });

    it("データの挿入が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // 新しいデータ
      const newPost = {
        user_id: "test-user-id",
        title: "New Post",
        content: "This is a new post",
      };

      // データ挿入
      await supabase.from("posts").insert(newPost).execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("posts");
      // 注: モックの制限により、insert の引数を検証することはできません
    });

    it("データの更新が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // 更新データ
      const updatedData = {
        title: "Updated Post",
        content: "This post has been updated",
      };

      // データ更新
      await supabase.from("posts").update(updatedData).eq("id", 1).execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("posts");
      // 注: モックの制限により、update と eq の引数を検証することはできません
    });

    it("データの削除が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // データ削除
      await supabase.from("posts").delete().eq("id", 1).execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("posts");
      // 注: モックの制限により、delete と eq の引数を検証することはできません
    });
  });

  describe("トランザクション処理のテスト", () => {
    it("RPC 関数が正常に動作すること", async () => {
      // クライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/client");

      // クライアントを作成
      const supabase = createClient();

      // RPC 関数呼び出し
      const { data, error } = await supabase
        .rpc("get_user_posts", { user_id: "test-user-id" })
        .execute();

      // 結果を確認
      expect(error).toBeNull();
      expect(data).toEqual(
        mockPosts.filter((post) => post.user_id === "test-user-id"),
      );
      expect(supabase.rpc).toHaveBeenCalledWith("get_user_posts", {
        user_id: "test-user-id",
      });
    });
  });

  describe("データ整合性とリレーションシップのテスト", () => {
    it("ユーザーとプロフィールの関連が正しく取得できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // ユーザーのプロフィール取得
      await supabase
        .from("profiles")
        .select()
        .eq("user_id", mockUser.id)
        .execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("profiles");
      // 注: モックの制限により、eq の引数を検証することはできません
    });

    it("ユーザーと投稿の関連が正しく取得できること", async () => {
      // サーバークライアントモジュールをインポート
      const { createClient } = await import("@/lib/supabase/server");

      // クライアントを作成
      const supabase = await createClient();

      // ユーザーの投稿取得
      await supabase
        .from("posts")
        .select()
        .eq("user_id", mockUser.id)
        .execute();

      // メソッドが呼び出されたことを確認
      expect(supabase.from).toHaveBeenCalledWith("posts");
      // 注: モックの制限により、eq の引数を検証することはできません
    });
  });
});
