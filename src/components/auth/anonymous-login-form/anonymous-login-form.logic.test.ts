import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnonymousLoginLogic } from "./anonymous-login-form.logic";

// next/navigationのモック
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// auth-featuresのモック
vi.mock("@/lib/auth/auth-features", () => ({
  getAuthFeatures: vi.fn(() => [
    { label: "Test Feature", value: "OK", isNegative: false },
  ]),
}));

// auth-errorsのモック
vi.mock("@/lib/auth/auth-errors", () => ({
  getAnonymousErrorInfo: vi.fn((error) => ({
    type: "unknown",
    message: "Test error message",
    recoverySteps: ["Step 1", "Step 2"],
  })),
}));

import { getAnonymousErrorInfo } from "@/lib/auth/auth-errors";

describe("useAnonymousLoginLogic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("正常に匿名認証を実行できる", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, redirectURL: "/home" }),
    } as Response);

    const { result } = renderHook(() => useAnonymousLoginLogic());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleAnonymousLogin(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/sign-in/anonymous", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: null, signature: null }),
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("APIエラーが発生した場合、エラー情報を設定する", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Authentication failed" }),
    } as Response);

    const { result } = renderHook(() => useAnonymousLoginLogic());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleAnonymousLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe("Test error message");
      expect(getAnonymousErrorInfo).toHaveBeenCalled();
    });
  });

  it("ネットワークエラーが発生した場合、エラー情報を設定する", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAnonymousLoginLogic());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleAnonymousLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(getAnonymousErrorInfo).toHaveBeenCalled();
    });
  });

  it("success=falseの場合、エラー情報を設定する", async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: false }),
    } as Response);

    const { result } = renderHook(() => useAnonymousLoginLogic());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleAnonymousLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(getAnonymousErrorInfo).toHaveBeenCalled();
    });
  });

  it("featuresが正しく取得される", () => {
    const { result } = renderHook(() => useAnonymousLoginLogic());

    expect(result.current.features).toHaveLength(1);
    expect(result.current.features[0]).toEqual({
      label: "Test Feature",
      value: "OK",
      isNegative: false,
    });
  });
});
