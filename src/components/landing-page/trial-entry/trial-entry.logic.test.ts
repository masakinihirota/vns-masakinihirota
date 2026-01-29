import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTrialEntry } from "./trial-entry.logic";

// モックの作成
const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("useTrialEntry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Cookieの初期化（ドキュメントのcookieプロパティをモック）
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("handleLocalModeStartが呼ばれるとCookieを設定して遷移する", () => {
    const { result } = renderHook(() => useTrialEntry());

    act(() => {
      result.current.handleLocalModeStart();
    });

    // Cookieが設定されているか確認
    expect(document.cookie).toContain("local_mode=true");
    expect(document.cookie).toContain("max-age=31536000");

    // 遷移が呼ばれたか確認
    expect(pushMock).toHaveBeenCalledWith("/beginning-country");
    expect(refreshMock).toHaveBeenCalled();
  });
});
