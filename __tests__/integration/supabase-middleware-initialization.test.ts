import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Supabase SSRのモック
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

// Next.js NextResponseのモック
vi.mock("next/server", async () => {
  const actual = await vi.importActual("next/server");
  return {
    ...actual,
    NextResponse: {
      next: vi.fn(),
      redirect: vi.fn(),
    },
  };
});

describe("Supabase ミドルウェア初期化テスト", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("ミドルウェアクライアント初期化", () => {
    it("正しい環境変数でミドルウェアクライアントを初期化する", async () => {
      const mockRequest = {
        nextUrl: { pathname: "/dashboard", clone: vi.fn() },
        cookies: {
          getAll: vi
            .fn()
            .mockReturnValue([
              { name: "sb-access-token", value: "test-token" },
            ]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        cookies: {
          set: vi.fn(),
          getAll: vi.fn().mockReturnValue([]),
        },
      };

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "test-user-id" } },
            error: null,
          }),
        },
      };

      const { createServerClient } = require("@supabase/ssr");
      createServerClient.mockReturnValue(mockSupabaseClient);

      const { NextResponse } = require("next/server");
      NextResponse.next.mockReturnValue(mockResponse);

      const result = await updateSession(mockRequest);

      expect(createServerClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-anon-key",
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function),
          }),
        }),
      );

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    it("クッキー操作が正しく設定される", async () => {
      const mockRequest = {
        nextUrl: { pathname: "/dashboard", clone: vi.fn() },
        cookies: {
          getAll: vi
            .fn()
            .mockReturnValue([
              { name: "sb-access-token", value: "test-token" },
            ]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        cookies: {
          set: vi.fn(),
          getAll: vi.fn().mockReturnValue([]),
        },
      };

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "test-user-id" } },
            error: null,
          }),
        },
      };

      const { createServerClient } = require("@supabase/ssr");
      let cookieConfig: any;
      createServerClient.mockImplementation((url, key, config) => {
        cookieConfig = config;
        return mockSupabaseClient;
      });

      const { NextResponse } = require("next/server");
      NextResponse.next.mockReturnValue(mockResponse);

      await updateSession(mockRequest);

      // getAll関数のテスト
      const getAllResult = cookieConfig.cookies.getAll();
      expect(mockRequest.cookies.getAll).toHaveBeenCalled();
      expect(getAllResult).toEqual([
        { name: "sb-access-token", value: "test-token" },
      ]);

      // setAll関数のテスト
      const testCookies = [
        { name: "new-cookie", value: "new-value", options: { httpOnly: true } },
      ];

      cookieConfig.cookies.setAll(testCookies);

      expect(mockRequest.cookies.set).toHaveBeenCalledWith(
        "new-cookie",
        "new-value",
      );
      expect(mockResponse.cookies.set).toHaveBeenCalledWith(
        "new-cookie",
        "new-value",
        { httpOnly: true },
      );
    });

    it("未認証ユーザーを適切にリダイレクトする", async () => {
      const mockUrl = {
        pathname: "/dashboard",
        clone: vi.fn().mockReturnValue({
          pathname: "/dashboard",
        }),
      };
      mockUrl.clone().pathname = "/login";

      const mockRequest = {
        nextUrl: mockUrl,
        cookies: {
          getAll: vi.fn().mockReturnValue([]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      };

      const mockRedirectResponse = { type: "redirect", url: "/login" };

      const { createServerClient } = require("@supabase/ssr");
      createServerClient.mockReturnValue(mockSupabaseClient);

      const { NextResponse } = require("next/server");
      NextResponse.next.mockReturnValue({ cookies: { set: vi.fn() } });
      NextResponse.redirect.mockReturnValue(mockRedirectResponse);

      const result = await updateSession(mockRequest);

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/login" }),
      );
      expect(result).toBe(mockRedirectResponse);
    });

    it("認証済みユーザーはリダイレクトされない", async () => {
      const mockRequest = {
        nextUrl: { pathname: "/dashboard", clone: vi.fn() },
        cookies: {
          getAll: vi
            .fn()
            .mockReturnValue([
              { name: "sb-access-token", value: "test-token" },
            ]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        cookies: {
          set: vi.fn(),
          getAll: vi.fn().mockReturnValue([]),
        },
      };

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: "test-user-id", email: "test@example.com" } },
            error: null,
          }),
        },
      };

      const { createServerClient } = require("@supabase/ssr");
      createServerClient.mockReturnValue(mockSupabaseClient);

      const { NextResponse } = require("next/server");
      NextResponse.next.mockReturnValue(mockResponse);

      const result = await updateSession(mockRequest);

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(result).toBe(mockResponse);
    });

    it("許可されたパスは認証なしでアクセス可能", async () => {
      const allowedPaths = ["/", "/login", "/lang", "/auth"];

      for (const path of allowedPaths) {
        const mockRequest = {
          nextUrl: { pathname: path, clone: vi.fn() },
          cookies: {
            getAll: vi.fn().mockReturnValue([]),
            set: vi.fn(),
          },
        } as unknown as NextRequest;

        const mockResponse = {
          cookies: {
            set: vi.fn(),
            getAll: vi.fn().mockReturnValue([]),
          },
        };

        const mockSupabaseClient = {
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: null },
              error: null,
            }),
          },
        };

        const { createServerClient } = require("@supabase/ssr");
        createServerClient.mockReturnValue(mockSupabaseClient);

        const { NextResponse } = require("next/server");
        NextResponse.next.mockReturnValue(mockResponse);

        const result = await updateSession(mockRequest);

        expect(NextResponse.redirect).not.toHaveBeenCalled();
        expect(result).toBe(mockResponse);

        vi.clearAllMocks();
      }
    });
  });

  describe("エラーハンドリング", () => {
    it("Supabase認証エラーを適切に処理する", async () => {
      const mockRequest = {
        nextUrl: { pathname: "/dashboard", clone: vi.fn() },
        cookies: {
          getAll: vi.fn().mockReturnValue([]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      const mockResponse = {
        cookies: {
          set: vi.fn(),
          getAll: vi.fn().mockReturnValue([]),
        },
      };

      const mockSupabaseClient = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "Invalid JWT" },
          }),
        },
      };

      const { createServerClient } = require("@supabase/ssr");
      createServerClient.mockReturnValue(mockSupabaseClient);

      const { NextResponse } = require("next/server");
      NextResponse.next.mockReturnValue(mockResponse);

      // エラーが発生してもクラッシュしないことを確認
      await expect(updateSession(mockRequest)).resolves.not.toThrow();
    });

    it("環境変数が未設定の場合にエラーをスローする", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const mockRequest = {
        nextUrl: { pathname: "/dashboard", clone: vi.fn() },
        cookies: {
          getAll: vi.fn().mockReturnValue([]),
          set: vi.fn(),
        },
      } as unknown as NextRequest;

      await expect(updateSession(mockRequest)).rejects.toThrow();
    });
  });
});
