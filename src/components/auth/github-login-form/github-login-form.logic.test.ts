import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useGitHubLoginLogic } from "./github-login-form.logic";

// auth-clientのモック
vi.mock("@/lib/auth-client", () => ({
  signIn: {
    social: vi.fn(),
  },
}));

// auth-featuresのモック
vi.mock("@/lib/auth/auth-features", () => ({
  getAuthFeatures: vi.fn(() => [
    { label: "Test Feature", value: "OK", isNegative: false },
  ]),
}));

// auth-errorsのモック
vi.mock("@/lib/auth/auth-errors", () => ({
  getOAuthErrorInfo: vi.fn((error) => ({
    type: "unknown",
    message: "Test error message",
    recoverySteps: ["Step 1", "Step 2"],
  })),
}));

import { signIn } from "@/lib/auth-client";
import { getOAuthErrorInfo } from "@/lib/auth/auth-errors";

describe("useGitHubLoginLogic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("正常にGitHub認証を実行できる", async () => {
    const mockSignIn = vi.mocked(signIn.social);
    mockSignIn.mockResolvedValue({ error: null } as any);

    const { result } = renderHook(() => useGitHubLoginLogic());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleSocialLogin(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSignIn).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/",
    });
  });

  it("エラーが発生した場合、エラー情報を設定する", async () => {
    const mockError = new Error("Auth failed");
    const mockSignIn = vi.mocked(signIn.social);
    mockSignIn.mockResolvedValue({ error: mockError } as any);

    const { result } = renderHook(() => useGitHubLoginLogic());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleSocialLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(result.current.error?.message).toBe("Test error message");
      expect(getOAuthErrorInfo).toHaveBeenCalledWith(mockError, "github");
    });
  });

  it("例外が発生した場合、エラー情報を設定する", async () => {
    const mockError = new Error("Network error");
    const mockSignIn = vi.mocked(signIn.social);
    mockSignIn.mockRejectedValue(mockError);

    const { result } = renderHook(() => useGitHubLoginLogic());

    const mockEvent = {
      preventDefault: vi.fn(),
    } as any;

    await act(async () => {
      await result.current.handleSocialLogin(mockEvent);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).not.toBeNull();
      expect(getOAuthErrorInfo).toHaveBeenCalledWith(mockError, "github");
    });
  });

  it("featuresが正しく取得される", () => {
    const { result } = renderHook(() => useGitHubLoginLogic());

    expect(result.current.features).toHaveLength(1);
    expect(result.current.features[0]).toEqual({
      label: "Test Feature",
      value: "OK",
      isNegative: false,
    });
  });
});
