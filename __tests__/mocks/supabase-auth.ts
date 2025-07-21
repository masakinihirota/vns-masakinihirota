import { vi } from "vitest";
import { MockUser, MockSession, MockAuthState } from "./supabase-types";

// 認証モック
export const mockUser: MockUser = {
  id: "test-user-id",
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
  email_confirmed_at: "2024-01-01T00:00:00.000Z",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  user_metadata: {
    name: "テストユーザー",
    avatar_url: "https://example.com/avatar.png",
  },
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
};

export const mockSession: MockSession = {
  access_token: "mock-access-token",
  refresh_token: "mock-refresh-token",
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: "bearer",
  user: mockUser,
};

// 拡張された認証状態管理
export const mockAuthState: MockAuthState = {
  user: null,
  session: null,

  // ログイン状態を設定
  setSession(session: MockSession | null): void {
    this.session = session;
    this.user = session?.user || null;
  },

  // メールとパスワードでログイン
  signInWithPassword: async ({
    email,
    password,
  }: { email: string; password: string }) => {
    if (email === "test@example.com" && password === "password123") {
      mockAuthState.user = mockUser;
      mockAuthState.session = {
        ...mockSession,
        expires_at: Date.now() + 3600000,
      };
      return {
        data: {
          user: mockUser,
          session: mockAuthState.session,
        },
        error: null,
      };
    }
    return {
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", status: 400 },
    };
  },

  // メールリンクでログイン
  signInWithOtp: async ({ email }: { email: string }) => {
    if (email === "test@example.com") {
      return {
        data: {
          user: null,
          session: null,
        },
        error: null,
      };
    }
    return {
      data: { user: null, session: null },
      error: { message: "Invalid email", status: 400 },
    };
  },

  // ソーシャルログイン
  signInWithOAuth: async ({ provider }: { provider: string }) => {
    return {
      data: { provider, url: `https://auth.example.com/oauth/${provider}` },
      error: null,
    };
  },

  // サインアップ
  signUp: async ({ email, password }: { email: string; password: string }) => {
    if (email === "new@example.com") {
      const newUser = {
        ...mockUser,
        id: "new-user-id",
        email: "new@example.com",
      };
      return {
        data: { user: newUser, session: null },
        error: null,
      };
    }
    return {
      data: { user: null, session: null },
      error: { message: "Email already registered", status: 400 },
    };
  },

  // ログアウト
  signOut: async () => {
    mockAuthState.user = null;
    mockAuthState.session = null;
    return { error: null };
  },

  // パスワードリセット
  resetPasswordForEmail: async (email: string) => {
    if (email === "test@example.com") {
      return { data: {}, error: null };
    }
    return {
      data: {},
      error: { message: "Email not found", status: 400 },
    };
  },

  // パスワード更新
  updateUser: async ({ password }: { password?: string }) => {
    if (mockAuthState.user) {
      return {
        data: { user: mockAuthState.user },
        error: null,
      };
    }
    return {
      data: { user: null },
      error: { message: "Not authenticated", status: 401 },
    };
  },

  // セッション取得
  getSession: async () => {
    if (mockAuthState.session) {
      // セッションの有効期限をチェック
      if (
        mockAuthState.session.expires_at &&
        mockAuthState.session.expires_at < Date.now()
      ) {
        mockAuthState.session = null;
        mockAuthState.user = null;
        return {
          data: { session: null },
          error: { message: "Session expired", status: 401 },
        };
      }
      return {
        data: { session: mockAuthState.session },
        error: null,
      };
    }
    return {
      data: { session: null },
      error: null,
    };
  },

  // ユーザー取得
  getUser: async () => {
    if (mockAuthState.user) {
      return {
        data: { user: mockAuthState.user },
        error: null,
      };
    }
    return {
      data: { user: null },
      error: null,
    };
  },

  // セッション更新
  refreshSession: async () => {
    if (mockAuthState.session) {
      mockAuthState.session = {
        ...mockAuthState.session,
        access_token: `refreshed-${Date.now()}`,
        expires_at: Date.now() + 3600000,
      };
      return {
        data: {
          session: mockAuthState.session,
          user: mockAuthState.user,
        },
        error: null,
      };
    }
    return {
      data: { session: null, user: null },
      error: { message: "No session to refresh", status: 401 },
    };
  },
};
