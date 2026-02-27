import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHomeTrialLogic } from "./home-trial.logic";

describe("useHomeTrialLogic", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    vi.clearAllMocks();
  });

  it("デフォルトで 'beginner' モードになること", () => {
    const { result } = renderHook(() => useHomeTrialLogic());
    expect(result.current.viewMode).toBe("beginner");
  });

  it("localStorage に設定がある場合、その設定を読み込むこと", () => {
    globalThis.localStorage.setItem(
      "homeTrialConfig",
      JSON.stringify({ viewMode: "latest" })
    );
    const { result } = renderHook(() => useHomeTrialLogic());
    expect(result.current.viewMode).toBe("latest");
  });

  it("モードを切り替えると state が更新され、localStorage に保存されること", () => {
    const { result } = renderHook(() => useHomeTrialLogic());

    act(() => {
      result.current.handleToggleView("latest");
    });

    expect(result.current.viewMode).toBe("latest");
    expect(globalThis.localStorage.getItem("homeTrialConfig")).toBe(
      JSON.stringify({ viewMode: "latest" })
    );

    act(() => {
      result.current.handleToggleView("beginner");
    });

    expect(result.current.viewMode).toBe("beginner");
    expect(globalThis.localStorage.getItem("homeTrialConfig")).toBe(
      JSON.stringify({ viewMode: "beginner" })
    );
  });
});
