import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi, beforeAll, afterAll } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";

// テスト用のメッセージ
const testMessages = {
  AppLayout: {
    home: "ホーム",
    logout: "ログアウト",
    profile: "プロフィール",
  },
  // 他の必要なメッセージをここに追加
};

// テスト用のプロバイダーラッパー
interface AllTheProvidersProps {
  children: React.ReactNode;
  locale?: string;
  theme?: string;
  messages?: Record<string, any>;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({
  children,
  locale = "ja",
  theme = "light",
  messages = testMessages,
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
      >
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
};

// カスタムレンダー関数
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  locale?: string;
  theme?: string;
  messages?: Record<string, any>;
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  const { locale, theme, messages, ...renderOptions } = options;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllTheProviders
      locale={locale}
      theme={theme}
      messages={messages}
    >
      {children}
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// テスト用ヘルパー関数
export const createTestUser = () => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "テストユーザー",
});

export const createTestMessages = (overrides: Record<string, any> = {}) => ({
  ...testMessages,
  ...overrides,
});

// 非同期コンポーネント用のヘルパー
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// フォーム送信のヘルパー
export const submitForm = async (form: HTMLFormElement) => {
  const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
  await waitForLoadingToFinish();
};

// エラーバウンダリーのテスト用ヘルパー
export const suppressConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

// ユーザーイベントのヘルパー
export const userEvent = {
  click: async (element: Element) => {
    const { act } = await import("@testing-library/react");
    await act(async () => {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(clickEvent);
    });
    await waitForLoadingToFinish();
  },

  type: async (element: Element, text: string) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const { act } = await import("@testing-library/react");
      await act(async () => {
        element.focus();
        element.value = text;
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
      });
      await waitForLoadingToFinish();
    }
  },

  clear: async (element: Element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      const { act } = await import("@testing-library/react");
      await act(async () => {
        element.focus();
        element.value = "";
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
      });
      await waitForLoadingToFinish();
    }
  },
};

// テーマ切り替えのヘルパー
export const renderWithTheme = (
  ui: ReactElement,
  theme: "light" | "dark" = "light",
) => {
  return customRender(ui, { theme });
};

// 国際化のヘルパー
export const renderWithLocale = (
  ui: ReactElement,
  locale = "ja",
  messages?: Record<string, any>,
) => {
  return customRender(ui, { locale, messages });
};

// 複数のプロバイダーを組み合わせたヘルパー
export const renderWithProviders = (
  ui: ReactElement,
  options: {
    theme?: "light" | "dark";
    locale?: string;
    messages?: Record<string, any>;
  } = {},
) => {
  return customRender(ui, options);
};

// React Testing Libraryの全てのエクスポートを再エクスポート
export * from "@testing-library/react";

// カスタムレンダー関数をデフォルトのrenderとして上書き
export { customRender as render };
