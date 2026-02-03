import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateProfilePage from "./page";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the container to bypass complex wizard logic
// We only want to test that the page handles the completion correctly
vi.mock("@/components/user-profiles/create", () => ({
  UserProfileCreationContainer: ({ onComplete }: any) => (
    <button
      data-testid="mock-complete-btn"
      onClick={() =>
        onComplete({
          displayName: "Test User",
          role: "Leader",
          purposes: ["create_work"],
        })
      }
    >
      Mock Complete
    </button>
  ),
}));

// Spy on localStorage
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: storageMock });

describe("CreateProfilePage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storageMock.clear();
    // Simulate trial config if needed, but page.tsx defaults to trial logic currently
    // checking `if (isTrial || true)` in page.tsx line 44.
  });

  it("should save profile to localStorage upon completion", async () => {
    render(<CreateProfilePage />);

    // Click the mock complete button
    const btn = screen.getByTestId("mock-complete-btn");
    fireEvent.click(btn);

    // Wait for async operations
    await waitFor(() => {
      // Check if localStorage.setItem was called
      expect(storageMock.setItem).toHaveBeenCalled();
    });

    // Check strict calls
    // It should set device ID (if missing) and profiles

    // Check profiles
    const calls = storageMock.setItem.mock.calls;
    const profileCall = calls.find((call) => call[0] === "vns_trial_profiles");
    expect(profileCall).toBeTruthy();

    const savedProfiles = JSON.parse(profileCall![1]);
    expect(Array.isArray(savedProfiles)).toBe(true);
    expect(savedProfiles.length).toBeGreaterThan(0);
    expect(savedProfiles[0].display_name).toBe("Test User");

    // Check router push
    // page.tsx waits 1000ms
    // We need to wait or advance timers if we want to check push
    // But persistence is the main goal here.
  });
});
