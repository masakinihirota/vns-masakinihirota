import { http, HttpResponse } from "msw";

// Hono API ルートのモックハンドラー
export const apiHandlers = [
  //hello エンドポイントのモック
  http.get("/api/hello", () => {
    return HttpResponse.json({
      message: "Hello from Hono!",
    });
  }),

  // エラーレスポンスのモック（テスト用）
  http.get("/api/hello/error", () => {
    return HttpResponse.json(
      {
        error: "Internal Server Error",
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }),

  // 認証が必要なエンドポイントのモック
  http.get("/api/protected", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        {
          error: "Unauthorized",
          message: "Authentication required",
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      message: "Protected resource accessed successfully",
      user: {
        id: "test-user-id",
        email: "test@example.com",
      },
    });
  }),

  // バリデーションエラーのモック
  http.post("/api/validate", async ({ request }) => {
    try {
      const body = await request.json();

      if (!body || typeof body !== "object") {
        return HttpResponse.json(
          {
            error: "Bad Request",
            message: "Invalid request body",
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({
        message: "Validation successful",
        data: body,
      });
    } catch (error) {
      // JSON パースエラーの場合
      return HttpResponse.json(
        {
          error: "Bad Request",
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }
  }),
];

// Supabase 認証 API のモックハンドラー
export const supabaseAuthHandlers = [
  // セッション取得のモック
  http.get("https://test.supabase.co/auth/v1/user", ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        {
          error: "invalid_token",
          error_description: "JWT expired",
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      id: "test-user-id",
      aud: "authenticated",
      role: "authenticated",
      email: "test@example.com",
      email_confirmed_at: "2024-01-01T00:00:00.000Z",
      phone: "",
      confirmed_at: "2024-01-01T00:00:00.000Z",
      last_sign_in_at: "2024-01-01T00:00:00.000Z",
      app_metadata: {
        provider: "email",
        providers: ["email"],
      },
      user_metadata: {},
      identities: [],
      created_at: "2024-01-01T00:00:00.000Z",
      updated_at: "2024-01-01T00:00:00.000Z",
    });
  }),

  // ログインのモック
  http.post("https://test.supabase.co/auth/v1/token", async ({ request }) => {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return HttpResponse.json(
        {
          error: "invalid_request",
          error_description: "Invalid request body",
        },
        { status: 400 },
      );
    }

    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return HttpResponse.json(
        {
          error: "invalid_grant",
          error_description: "Invalid login credentials",
        },
        { status: 400 },
      );
    }

    // テスト用の認証情報
    if (email === "test@example.com" && password === "password123") {
      return HttpResponse.json({
        access_token: "test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "test-refresh-token",
        user: {
          id: "test-user-id",
          aud: "authenticated",
          role: "authenticated",
          email: "test@example.com",
          email_confirmed_at: "2024-01-01T00:00:00.000Z",
          phone: "",
          confirmed_at: "2024-01-01T00:00:00.000Z",
          last_sign_in_at: "2024-01-01T00:00:00.000Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {},
          identities: [],
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
      });
    }

    return HttpResponse.json(
      {
        error: "invalid_grant",
        error_description: "Invalid login credentials",
      },
      { status: 400 },
    );
  }),

  // ログアウトのモック
  http.post("https://test.supabase.co/auth/v1/logout", () => {
    return HttpResponse.json({}, { status: 204 });
  }),

  // セッション更新のモック
  http.post("https://test.supabase.co/auth/v1/token", async ({ request }) => {
    const body = await request.json();
    const { grant_type, refresh_token } = body as {
      grant_type?: string;
      refresh_token?: string;
    };

    if (
      grant_type === "refresh_token" &&
      refresh_token === "test-refresh-token"
    ) {
      return HttpResponse.json({
        access_token: "new-test-access-token",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "new-test-refresh-token",
        user: {
          id: "test-user-id",
          aud: "authenticated",
          role: "authenticated",
          email: "test@example.com",
          email_confirmed_at: "2024-01-01T00:00:00.000Z",
          phone: "",
          confirmed_at: "2024-01-01T00:00:00.000Z",
          last_sign_in_at: "2024-01-01T00:00:00.000Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {},
          identities: [],
          created_at: "2024-01-01T00:00:00.000Z",
          updated_at: "2024-01-01T00:00:00.000Z",
        },
      });
    }

    return HttpResponse.json(
      {
        error: "invalid_grant",
        error_description: "Invalid refresh token",
      },
      { status: 400 },
    );
  }),
];

// エラーレスポンスとエッジケースのモック
export const errorHandlers = [
  // ネットワークエラーのモック
  http.get("/api/network-error", () => {
    return HttpResponse.error();
  }),

  // タイムアウトのモック
  http.get("/api/timeout", () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json({ message: "Delayed response" }));
      }, 5000);
    });
  }),

  // レート制限のモック
  http.get("/api/rate-limit", () => {
    return HttpResponse.json(
      {
        error: "Too Many Requests",
        message: "Rate limit exceeded",
        retry_after: 60,
      },
      { status: 429 },
    );
  }),

  // サーバーメンテナンスのモック
  http.get("/api/maintenance", () => {
    return HttpResponse.json(
      {
        error: "Service Unavailable",
        message: "Server is under maintenance",
      },
      { status: 503 },
    );
  }),

  // 不正なJSONレスポンスのモック
  http.get("/api/invalid-json", () => {
    return new Response("Invalid JSON response", {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];

// 全てのハンドラーをまとめてエクスポート
export const handlers = [
  ...apiHandlers,
  ...supabaseAuthHandlers,
  ...errorHandlers,
];
