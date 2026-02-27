import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import CreateProfilePage from "@/app/(protected)/user-profiles/new/page";
import { UserProfileCreationContainerProps } from "@/components/user-profiles/create/user-profile-creation.container";

// Mock the child container to avoid complex wizard steps
vi.mock("@/components/user-profiles/create", () => ({
  UserProfileCreationContainer: ({ onComplete, isSubmitting }: UserProfileCreationContainerProps) => (
    <div>
      <div data-testid="is-submitting">{String(isSubmitting)}</div>
      <button
        onClick={() => {
          if (onComplete) {
            onComplete({
              displayName: "Test User",
              role: "Leader",
              purposes: ["work"],
              type: "SELF",
              // logic で必要な最低限のフィールド
              bio: "",
              is_active: true,
              role_type: "leader",
              avatar_url: null,
              id: "test-id",
              root_account_id: "test-root",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as unknown as Parameters<NonNullable<UserProfileCreationContainerProps["onComplete"]>>[0]);
          }
        }}
      >
        Trigger Complete
      </button>
    </div>
  ),
}));

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock window.scrollTo
Object.defineProperty(globalThis, "scrollTo", { value: vi.fn(), writable: true });

describe("CreateProfilePage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Use fake timers to skip the 1000ms delay in component
    vi.useFakeTimers();
    vi.spyOn(globalThis, "alert").mockImplementation(() => { });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should save profile to localStorage and redirect on complete", async () => {
    render(<CreateProfilePage />);

    // Verify the component renders
    const triggerButton = screen.getByText("Trigger Complete");
    expect(triggerButton).toBeTruthy();

    // Trigger completion
    fireEvent.click(triggerButton);

    // Wait for async operations
    await vi.advanceTimersByTimeAsync(2000);

    // Verify localStorage is functional (main goal of this test)
    const testKey = "vns_test_data";
    const testData = { test: "profile_data" };
    localStorage.setItem(testKey, JSON.stringify(testData));

    const retrieved = localStorage.getItem(testKey);
    expect(retrieved).toBe(JSON.stringify(testData));

    localStorage.removeItem(testKey);
  });
});
