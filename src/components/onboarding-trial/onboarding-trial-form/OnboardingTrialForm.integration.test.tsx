import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OnboardingTrialForm } from "./OnboardingTrialForm";

// Mock useRouter
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

beforeEach(() => {
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
  };

  // Spy on localStorage
  vi.spyOn(Storage.prototype, "setItem");

  // Mock window.alert
  vi.spyOn(window, "alert").mockImplementation(() => { });

  vi.clearAllMocks();
  localStorage.clear();
  vi.useFakeTimers();
});

describe("OnboardingTrialForm Integration", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should save trial data to localStorage upon completion", async () => {
    render(<OnboardingTrialForm />);

    // Step 1: Declarations
    // We need to verify what element allows proceeding.
    // If there is a checkbox, we click it.
    // Assuming role="checkbox" exists.
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Click Next (Step 1 -> 2)
    const nextButton = screen.getByRole("button", { name: "次へ" });
    fireEvent.click(nextButton);

    // Step 2: Residence
    // Click Next (Step 2 -> 3)
    fireEvent.click(nextButton);

    // Step 3: Hours
    // Click Next (Step 3 -> 4)
    fireEvent.click(nextButton);

    // Step 4: Identity
    // Click Next (Step 4 -> 5)
    fireEvent.click(nextButton);

    // Step 5: Language
    // Click Next (Step 5 -> 6 "確認画面へ")
    const confirmButton = screen.getByRole("button", { name: "確認画面へ" });
    fireEvent.click(confirmButton);

    // Step 6: Confirmation
    // Click Submit ("利用開始")
    const submitButton = screen.getByRole("button", { name: "利用開始" });
    fireEvent.click(submitButton);

    // Wait for async submission
    await vi.runAllTimersAsync();

    // Verify localStorage
    // Use the spy created in beforeEach or create one if needed, but best to use the one from beforeEach.
    // However, the test framework suggests referencing unbound methods is bad.
    // Since we spy on prototype in beforeEach, we can check that.
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");
    expect(setItemSpy).toHaveBeenCalled();
    // Check the LAST call which should be the final save
    const lastCall = setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1];
    expect(lastCall).toBeTruthy();
    const [key, value] = lastCall!;

    expect(key).toBe("vns_trial_data");
    expect(value).toContain("trial-");
    expect(value).toContain("agreed_oasis");
    // Ensure rootAccount is populated
    const parsed = JSON.parse(value as string);
    expect(parsed.rootAccount).not.toBeNull();
    expect(parsed.rootAccount.display_id).toMatch(/^trial-/);
  });
});
