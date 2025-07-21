import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import HomePage from "@/app/(unauth)/page";

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
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

describe("認証不要ページのテスト", () => {
  describe("ホームページ", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("正常にレンダリングされること", () => {
      renderWithProviders(<HomePage />);

      // 基本的なUI要素が存在することを確認
      expect(screen.getByText("TOPページ")).toBeInTheDocument();
      expect(screen.getByTestId("link-to--landing")).toBeInTheDocument();
      expect(screen.getByTestId("link-to--pricing")).toBeInTheDocument();
      expect(screen.getByTestId("link-to--login")).toBeInTheDocument();
    });

    it("国際化されたコンテンツが表示されること", () => {
      renderWithProviders(<HomePage />);

      // 国際化されたテキストが表示されることを確認
      expect(screen.getByText("HomePage.title")).toBeInTheDocument();
      expect(screen.getByText("AppLayout.home")).toBeInTheDocument();
    });

    it("異なるロケールでレンダリングされること", () => {
      // 英語ロケールでレンダリング
      renderWithProviders(<HomePage />, { locale: "en" });

      // 国際化されたテキストが表示されることを確認
      expect(screen.getByText("HomePage.title")).toBeInTheDocument();
      expect(screen.getByText("AppLayout.home")).toBeInTheDocument();
    });
  });
});
