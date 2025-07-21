import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import LocaleSwitcher from "@/components/i18n/LocaleSwitcher";
import { locales, defaultLocale } from "@/components/i18n/config";

// next-intl のモック
vi.mock("next-intl", () => ({
  useTranslations: vi.fn((namespace) => (key: string) => `${namespace}.${key}`),
  useLocale: vi.fn(() => "ja"),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// next/navigation のモック
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// locale.ts のモック
vi.mock("@/components/i18n/locale", () => ({
  getUserLocale: vi.fn(() => Promise.resolve("ja")),
  setUserLocale: vi.fn(),
}));

describe("国際化のテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("設定", () => {
    it("サポートされているロケールが正しく設定されていること", () => {
      expect(locales).toContain("ja");
      expect(locales).toContain("en");
      expect(locales).toContain("de");
    });

    it("デフォルトロケールが正しく設定されていること", () => {
      expect(defaultLocale).toBe("ja");
    });
  });

  describe("LocaleSwitcher コンポーネント", () => {
    it("正常にレンダリングされること", () => {
      render(<LocaleSwitcher />);

      // LocaleSwitcher.label が表示されることを確認
      expect(screen.getByLabelText("LocaleSwitcher.label")).toBeInTheDocument();
    });
  });

  describe("国際化メッセージ", () => {
    it("日本語のメッセージが正しく設定されていること", async () => {
      const jaMessages = await import("@/components/i18n/messages/ja.json");
      expect(jaMessages).toBeDefined();
      expect(jaMessages.default.AppLayout.home).toBe("AppLayout ホーム");

      const jaHomePageMessages = await import(
        "@/components/i18n/messages/ja/home-page.json"
      );
      expect(jaHomePageMessages).toBeDefined();
      expect(jaHomePageMessages.default.HomePage.title).toBe("ホーム");

      const jaLocaleSwitcherMessages = await import(
        "@/components/i18n/messages/ja/locale-switcher.json"
      );
      expect(jaLocaleSwitcherMessages).toBeDefined();
      expect(jaLocaleSwitcherMessages.default.LocaleSwitcher.ja).toBe("日本語");
      expect(jaLocaleSwitcherMessages.default.LocaleSwitcher.en).toBe("英語");
    });

    it("英語のメッセージが正しく設定されていること", async () => {
      const enMessages = await import("@/components/i18n/messages/en.json");
      expect(enMessages).toBeDefined();
      expect(enMessages.default.AppLayout.home).toBe("AppLayout Home");

      const enHomePageMessages = await import(
        "@/components/i18n/messages/en/home-page.json"
      );
      expect(enHomePageMessages).toBeDefined();
      expect(enHomePageMessages.default.HomePage.title).toBe("Home");

      const enLocaleSwitcherMessages = await import(
        "@/components/i18n/messages/en/locale-switcher.json"
      );
      expect(enLocaleSwitcherMessages).toBeDefined();
      expect(enLocaleSwitcherMessages.default.LocaleSwitcher.ja).toBe(
        "Japanese",
      );
      expect(enLocaleSwitcherMessages.default.LocaleSwitcher.en).toBe(
        "English",
      );
    });
  });
});
