import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// React Testing Library のクリーンアップ
afterEach(() => {
  cleanup();
});

// DOM 環境のセットアップ
beforeAll(() => {
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
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // localStorage のモック
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  vi.stubGlobal("localStorage", localStorageMock);

  // sessionStorage のモック
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  vi.stubGlobal("sessionStorage", sessionStorageMock);

  // fetch のモック（MSW を使用する場合は不要だが、フォールバック用）
  global.fetch = vi.fn();

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
});

// テスト終了時のクリーンアップ
afterAll(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

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

// Supabase のモック（基本的なモック、詳細は個別テストで設定）
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  })),
}));

// 環境変数のモック
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
