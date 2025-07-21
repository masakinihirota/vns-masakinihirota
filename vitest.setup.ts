import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { mswServer } from "./__tests__/mocks/server";

/**
 * 最適化されたテストセットアップファイル
 *
 * 要件6.1, 6.3に基づいて、テスト実行時間を最適化するために
 * 不要なセットアップを削減し、効率的なテスト環境を構築します。
 */

// テストタイプに基づいて条件付きでセットアップを実行する関数
const isUnitTest = () => {
  const testPath = process.env.VITEST_TEST_PATH || "";
  return !testPath.includes("integration") && !testPath.includes("e2e");
};

const isIntegrationTest = () => {
  const testPath = process.env.VITEST_TEST_PATH || "";
  return testPath.includes("integration");
};

const isE2ETest = () => {
  const testPath = process.env.VITEST_TEST_PATH || "";
  return testPath.includes("e2e");
};

// 共通のクリーンアップ（すべてのテストタイプで実行）
afterEach(() => {
  cleanup();
  // MSW ハンドラーをリセット
  mswServer.reset();
});

// DOM 環境のセットアップ（すべてのテストタイプで実行）
beforeAll(() => {
  // MSW サーバーを開始
  mswServer.start();

  // 基本的なブラウザAPIのモック
  setupBasicMocks();
});

// テスト終了時のクリーンアップ（すべてのテストタイプで実行）
afterAll(() => {
  // MSW サーバーを停止
  mswServer.stop();
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

// 基本的なブラウザAPIのモック設定
function setupBasicMocks() {
  // ResizeObserver のモック（Radix UI コンポーネントで必要）
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // IntersectionObserver のモック
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // matchMedia のモック（レスポンシブデザインテスト用）
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // URL のモック
  global.URL.createObjectURL = vi.fn();
  global.URL.revokeObjectURL = vi.fn();

  // console のモック（テスト実行時のログを制御）
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // React の開発モード警告を除外
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalConsoleError(...args);
  };
}

// ストレージモックの遅延初期化（必要な場合のみ）
let localStorageMock: any;
let sessionStorageMock: any;

function getLocalStorageMock() {
  if (!localStorageMock) {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  }
  return localStorageMock;
}

function getSessionStorageMock() {
  if (!sessionStorageMock) {
    sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  }
  return sessionStorageMock;
}

// 単体テストとコンポーネントテスト用の追加セットアップ
if (isUnitTest()) {
  beforeEach(() => {
    // ストレージモックは単体テストでのみ必要な場合が多い
    vi.stubGlobal("localStorage", getLocalStorageMock());
    vi.stubGlobal("sessionStorage", getSessionStorageMock());
  });
}

// 統合テスト用の追加セットアップ
if (isIntegrationTest()) {
  beforeAll(() => {
    // 統合テスト固有のセットアップ
    setupNextJsMocks();
    setupSupabaseMocks();
  });
}

// Next.js関連のモック設定
function setupNextJsMocks() {
  // Next.js の環境変数のモック
  vi.mock("next/config", () => ({
    default: () => ({
      publicRuntimeConfig: {},
      serverRuntimeConfig: {},
    }),
  }));

  // Next.js の router のモック
  vi.mock("next/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
  }));

  // Next.js の Image コンポーネントのモック
  vi.mock("next/image", () => ({
    default: vi.fn().mockImplementation((props: any) => props),
  }));

  // Next.js の Link コンポーネントのモック
  vi.mock("next/link", () => ({
    default: vi.fn().mockImplementation(({ children, ...props }: any) => ({
      children,
      ...props,
    })),
  }));

  // next-intl のモック
  vi.mock("next-intl", () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => "ja",
    useMessages: () => ({}),
    NextIntlClientProvider: vi
      .fn()
      .mockImplementation(
        ({ children }: { children: React.ReactNode }) => children,
      ),
    getTranslations: vi.fn(() => (key: string) => key),
    getLocale: vi.fn(() => Promise.resolve("ja")),
  }));

  // next-themes のモック
  vi.mock("next-themes", () => ({
    useTheme: () => ({
      theme: "light",
      setTheme: vi.fn(),
      resolvedTheme: "light",
      themes: ["light", "dark"],
      systemTheme: "light",
    }),
    ThemeProvider: vi
      .fn()
      .mockImplementation(
        ({ children }: { children: React.ReactNode }) => children,
      ),
  }));
}

// Supabase関連のモック設定
function setupSupabaseMocks() {
  // Supabase クライアントのモック
  vi.mock("@/lib/supabase/client", async () => {
    const { createClient } = await import("./__tests__/mocks/supabase-client");
    return { createClient };
  });

  vi.mock("@/lib/supabase/server", async () => {
    const { createClient } = await import("./__tests__/mocks/supabase-server");
    return { createClient };
  });

  // @supabase/ssr のモック
  vi.mock("@supabase/ssr", () => ({
    createBrowserClient: vi.fn(() => {
      const { mockBrowserClient } = require("./__tests__/mocks/supabase");
      return mockBrowserClient;
    }),
    createServerClient: vi.fn(() => {
      const { mockServerClient } = require("./__tests__/mocks/supabase");
      return mockServerClient;
    }),
  }));

  // 環境変数のモック
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
}
