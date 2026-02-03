import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CreateProfilePage from "@/app/(protected)/user-profiles/new/page";

// Mock the child container to avoid complex wizard steps
vi.mock("@/components/user-profiles/create", () => ({
  UserProfileCreationContainer: ({ onComplete, isSubmitting }: any) => (
    <div>
      <div data-testid="is-submitting">{String(isSubmitting)}</div>
      <button
        onClick={() =>
          onComplete({
            displayName: "Test User",
            role: "Leader",
            purposes: ["work"],
            type: "SELF",
          })
        }
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
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

describe("CreateProfilePage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Use fake timers to skip the 1000ms delay in component
    vi.useFakeTimers();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should save profile to localStorage and redirect on complete", async () => {
    render(<CreateProfilePage />);

    // 1. Trigger completion via the mocked container
    const triggerBtn = screen.getByText("Trigger Complete");
    fireEvent.click(triggerBtn);

    // 2. Wait for async operations (localStorage & router push)
    // Advance timers by enough time to cover the 1000ms delay and some buffers
    await vi.advanceTimersByTimeAsync(2000);

    // Check if submitting state was set (it might be false now if finished)
    // Actually if it finished successfully, it calls push.

    // Check if push called
    expect(mockPush).toHaveBeenCalledWith("/home-trial");

    // 3. Verify localStorage
    // Check if device ID was created
    const deviceId = localStorage.getItem("vns_device_id");
    expect(deviceId).toBeTruthy();

    // Check if profile was saved
    const storedProfiles = localStorage.getItem("vns_trial_profiles");
    expect(storedProfiles).toBeTruthy();

    const profiles = JSON.parse(storedProfiles!);
    expect(profiles).toHaveLength(1);
    expect(profiles[0]).toMatchObject({
      display_name: "Test User",
      role_type: "leader",
      purposes: ["work"],
    });
    expect(profiles[0].root_account_id).toBe(deviceId);
  });
});
