import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";

describe("useIsMobile フック", () => {
  // テスト用のMatchMediaモック
  let matchMediaMock: any;
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  // 各テスト前にwindow.matchMediaとwindow.innerWidthをモック
  beforeEach(() => {
    addEventListenerSpy = vi.fn();
    removeEventListenerSpy = vi.fn();

    // matchMediaのモック実装
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // 非推奨だが互換性のために残す
      removeListener: vi.fn(), // 非推奨だが互換性のために残す
      addEventListener: addEventListenerSpy,
      removeEventListener: removeEventListenerSpy,
      dispatchEvent: vi.fn(),
    }));

    // window.matchMediaをモックで置き換え
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  // 各テスト後にモックをリセット
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("初期レンダリング時にウィンドウ幅に基づいてisMobileを設定する", () => {
    // デスクトップサイズをシミュレート
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // モバイルサイズをシミュレート
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });

    const { result: mobileResult } = renderHook(() => useIsMobile());
    expect(mobileResult.current).toBe(true);
  });

  it("メディアクエリの変更イベントリスナーを登録する", () => {
    renderHook(() => useIsMobile());
    expect(matchMediaMock).toHaveBeenCalledWith("(max-width: 767px)");
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("アンマウント時にイベントリスナーを削除する", () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("メディアクエリの変更に応じてisMobileを更新する", () => {
    // 初期状態はデスクトップ
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // メディアクエリの変更をシミュレート
    const changeHandler = addEventListenerSpy.mock.calls[0][1];

    // モバイルサイズに変更
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });

    // actでステート更新をラップ
    act(() => {
      changeHandler();
    });

    expect(result.current).toBe(true);
  });

  it("ブレークポイントの境界値をテストする", () => {
    // ブレークポイント境界値（768px）未満
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });
    const { result: mobileResult } = renderHook(() => useIsMobile());
    expect(mobileResult.current).toBe(true);

    // ブレークポイント境界値（768px）以上
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });
    const { result: desktopResult } = renderHook(() => useIsMobile());
    expect(desktopResult.current).toBe(false);
  });
});
