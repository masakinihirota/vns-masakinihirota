/**
 * レンダリング関連のテストヘルパー
 *
 * このモジュールは、コンポーネントのレンダリングに関連するヘルパー関数を提供します。
 * テーマ、国際化、その他のプロバイダーを含むテスト環境を設定します。
 */

import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
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

/**
 * カスタムレンダー関数
 *
 * テーマ、国際化、その他のプロバイダーを含むテスト環境でコンポーネントをレンダリングします。
 *
 * @param ui レンダリングするReact要素
 * @param options レンダリングオプション（locale, theme, messagesを含む）
 * @returns レンダリング結果
 */
export const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {},
) => {
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

/**
 * テーマを指定してコンポーネントをレンダリングするヘルパー
 *
 * @param ui レンダリングするReact要素
 * @param theme テーマ（"light"または"dark"）
 * @returns レンダリング結果
 */
export const renderWithTheme = (
  ui: ReactElement,
  theme: "light" | "dark" = "light",
) => {
  return customRender(ui, { theme });
};

/**
 * ロケールを指定してコンポーネントをレンダリングするヘルパー
 *
 * @param ui レンダリングするReact要素
 * @param locale ロケール（デフォルト: "ja"）
 * @param messages 翻訳メッセージ
 * @returns レンダリング結果
 */
export const renderWithLocale = (
  ui: ReactElement,
  locale = "ja",
  messages?: Record<string, any>,
) => {
  return customRender(ui, { locale, messages });
};

/**
 * 複数のプロバイダーを組み合わせてコンポーネントをレンダリングするヘルパー
 *
 * @param ui レンダリングするReact要素
 * @param options レンダリングオプション
 * @returns レンダリング結果
 */
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

/**
 * テスト用のメッセージを作成するヘルパー
 *
 * @param overrides デフォルトのメッセージをオーバーライドするオブジェクト
 * @returns テスト用のメッセージオブジェクト
 */
export const createTestMessages = (
  overrides: Record<string, any> = {},
): Record<string, any> => ({
  ...testMessages,
  ...overrides,
});

// React Testing Libraryの全てのエクスポートを再エクスポート
export * from "@testing-library/react";

// カスタムレンダー関数をデフォルトのrenderとして上書き
export { customRender as render };
