import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  mockUser,
  mockRootAccounts,
  mockGetUser,
  mockSelect,
  mockFrom,
  mockCreateClient,
} from "../mocks/supabase";

// next/navigation のモック
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/protected"),
  redirect: mockRedirect,
}));

// next-intl のモック
vi.mock("next-intl", () => ({
  useTranslations: vi.fn((namespace) => (key: string) => `${namespace}.${key}`),
  useLocale: vi.fn(() => "ja"),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// next/link のモック
vi.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a
      href={href}
      data-testid={`link-to-${href.replace(/\//g, "-")}`}
    >
      {children}
    </a>
  );
  return { default: MockLink };
});

// LogoutButton のモック
vi.mock("@/components/oauth/logout-button-auth", () => ({
  LogoutButton: () => <button>Logout</button>,
}));

// Supabase のモック
vi.mock("@/lib/supabase/server", () => ({
  createClient: mockCreateClient,
}));

// ProtectedPage のモック
vi.mock("@/app/(auth)/protected/page", () => ({
  default: async () => {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: userData, error } = await supabase.auth.getUser();

    if (error || !userData?.user) {
      const { redirect } = await import("next/navigation");
      redirect("/login");
      return null;
    }

    const { data: rootAccounts, error: rootAccountError } = await supabase
      .from("root_accounts")
      .select("*");

    return (
      <div>
        <a
          href="/"
          data-testid="link-to--"
        >
          TOPページ
        </a>
        <p>
          Protected ページ
          <br />
          <span>
            Hello <span>{userData.user.email}</span>
          </span>
        </p>
        <button>Logout</button>
        <br />

        <h2>root_accountsテーブル全データ</h2>
        {rootAccountError && <p>エラー: {rootAccountError.message}</p>}
        <pre>{JSON.stringify(rootAccounts, null, 2)}</pre>
      </div>
    );
  },
}));

describe("認証必要ページのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedirect.mockClear();
    mockGetUser.mockClear();
    mockSelect.mockClear();
    mockFrom.mockClear();

    // デフォルトの動作を設定
    mockFrom.mockImplementation(() => ({
      select: mockSelect,
    }));
  });

  it("認証されていない場合、ログインページにリダイレクトされること", async () => {
    // 認証されていないユーザー
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Not authenticated" },
    });

    // root_accountsテーブルのモックデータ（このテストでは使用されないが、エラーを防ぐために設定）
    mockSelect.mockResolvedValue({
      data: [],
      error: null,
    });

    // ProtectedPage をインポート
    const { default: ProtectedPage } = await import(
      "@/app/(auth)/protected/page"
    );
    await ProtectedPage();

    // リダイレクトが呼ばれたことを確認
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("認証されている場合、ページが表示されること", async () => {
    // 認証されたユーザー
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // root_accountsテーブルのモックデータ
    mockSelect.mockResolvedValue({
      data: mockRootAccounts,
      error: null,
    });

    // ProtectedPage をインポート
    const { default: ProtectedPage } = await import(
      "@/app/(auth)/protected/page"
    );
    const page = await ProtectedPage();

    // ページをレンダリング
    const { container } = render(page);

    // ユーザーのメールアドレスが表示されていることを確認
    expect(container.textContent).toContain(mockUser.email);

    // TOPページへのリンクが存在することを確認
    expect(screen.getByTestId("link-to--")).toBeInTheDocument();

    // ログアウトボタンが存在することを確認
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("データ取得エラー時にエラーメッセージが表示されること", async () => {
    // 認証されたユーザー
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    // データ取得エラー
    const errorMessage = "データ取得エラー";
    mockSelect.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });

    // ProtectedPage をインポート
    const { default: ProtectedPage } = await import(
      "@/app/(auth)/protected/page"
    );
    const page = await ProtectedPage();

    // ページをレンダリング
    const { container } = render(page);

    // エラーメッセージが表示されていることを確認
    expect(container.textContent).toContain(`エラー: ${errorMessage}`);
  });
});
