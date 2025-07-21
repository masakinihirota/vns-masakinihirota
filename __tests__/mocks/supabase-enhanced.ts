import { vi } from "vitest";

// 型定義
interface SupabaseResponse<T> {
  data: T | null;
  error: null | {
    message: string;
    status?: number;
    code?: string;
    details?: string;
  };
}

interface MockUser {
  id: string;
  email: string;
  aud: string;
  role: "authenticated";
  email_confirmed_at: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: "bearer";
  user: MockUser;
}

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
const mockAuthState = {
  user: null as MockUser | null,
  session: null as MockSession | null,
};

/**
 * ログイン状態を設定
 */
export function setSession(session: MockSession | null): void {
  mockAuthState.session = session;
  mockAuthState.user = session?.user || null;
}

// 認証メソッド
export const mockGetUser = vi.fn(async () => {
  if (mockAuthState.user) {
    return {
      data: { user: mockAuthState.user },
      error: null,
    };
  } else {
    return {
      data: { user: null },
      error: { message: "Not authenticated", status: 401 },
    };
  }
});

export const mockGetSession = vi.fn(async () => {
  if (mockAuthState.session) {
    // セッションの有効期限をチェック
    if (
      mockAuthState.session.expires_at &&
      mockAuthState.session.expires_at < Date.now()
    ) {
      mockAuthState.session = null;
      mockAuthState.user = null;
    }
  }

  if (mockAuthState.session) {
    return {
      data: { session: mockAuthState.session },
      error: null,
    };
  } else {
    return {
      data: { session: null },
      error: null,
    };
  }
});

// テストデータ
export const mockRootAccounts = [
  {
    id: "1",
    name: "Root Account 1",
    email: "root1@example.com",
    created_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Root Account 2",
    email: "root2@example.com",
    created_at: "2024-01-02T00:00:00.000Z",
  },
];

// モック関数のエクスポート
export const mockFrom = vi.fn();
export const mockSelect = vi.fn();
export const mockCreateClient = vi.fn(() => ({
  auth: {
    getUser: mockGetUser,
    getSession: mockGetSession,
  },
  from: mockFrom,
}));
