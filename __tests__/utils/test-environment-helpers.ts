/**
 * テスト環境設定関連のヘルパー
 *
 * このモジュールは、テスト環境の設定に関連するヘルパー関数を提供します。
 * コンソール出力の抑制、モックのセットアップなどを含みます。
 */

import { vi, beforeAll, afterAll } from "vitest";

/**
 * コンソールエラー出力を抑制するヘルパー
 * エラーバウンダリーのテストなど、意図的にエラーを発生させるテストで使用します。
 */
export const suppressConsoleError = () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });
};

/**
 * コンソール警告出力を抑制するヘルパー
 */
export const suppressConsoleWarning = () => {
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = vi.fn();
  });
  afterAll(() => {
    console.warn = originalWarn;
  });
};

/**
 * すべてのコンソール出力を抑制するヘルパー
 */
export const suppressAllConsoleOutput = () => {
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeAll(() => {
    console.log = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
  });

  afterAll(() => {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
  });
};

/**
 * 特定のコンソールメッセージのみを抑制するヘルパー
 *
 * @param pattern 抑制するメッセージのパターン（文字列または正規表現）
 */
export const suppressSpecificConsoleMessages = (pattern: string | RegExp) => {
  const originalError = console.error;
  const originalWarn = console.warn;

  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].match(pattern)) {
        return;
      }
      originalError(...args);
    };

    console.warn = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].match(pattern)) {
        return;
      }
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
  });
};

/**
 * テスト環境のウィンドウサイズを設定するヘルパー
 * レスポンシブデザインのテストに使用します。
 *
 * @param width ウィンドウの幅
 * @param height ウィンドウの高さ
 */
export const setTestWindowSize = (width: number, height: number) => {
  beforeAll(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });

    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: height,
    });

    window.dispatchEvent(new Event("resize"));
  });
};

/**
 * テスト環境のメディアクエリを設定するヘルパー
 *
 * @param matches メディアクエリがマッチするかどうか
 */
export const setTestMediaQuery = (matches: boolean) => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
};
