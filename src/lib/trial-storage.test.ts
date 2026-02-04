import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_POINTS, TrialStorage } from "./trial-storage";

describe("TrialStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("should initialize with default points", () => {
    const data = TrialStorage.init();
    expect(data.points.current).toBe(INITIAL_POINTS);
  });

  it("should consume points normally", () => {
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0));
    TrialStorage.init();
    vi.advanceTimersByTime(10000);

    const success = TrialStorage.consumePoints(10);
    expect(success).toBe(true);
    const data = TrialStorage.load();
    expect(data?.points.current).toBe(INITIAL_POINTS - 10);
  });

  it("should not allow consumption if points are insufficient", () => {
    // Consume almost all
    TrialStorage.save({
      ...TrialStorage.init(),
      points: { current: 5, lastActionAt: 0, consecutiveFastActions: 0 },
    });
    const success = TrialStorage.consumePoints(10);
    expect(success).toBe(false);
  });

  it("should apply penalty for rapid actions", () => {
    // Set time to known start
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0));
    TrialStorage.init();

    // Advance time to avoid penalty on first action (vs init time)
    vi.advanceTimersByTime(10000);
    TrialStorage.consumePoints(1); // Normal (1st). Cost: 1.

    // Immediate second action (<300ms)
    vi.advanceTimersByTime(100);
    TrialStorage.consumePoints(1); // Rapid (2nd). Cost: 1 * 2^1 = 2.

    const data = TrialStorage.load();
    // Total used: 1 + 2 = 3.
    // Remaining: 1997
    expect(data?.points.current).toBe(INITIAL_POINTS - 3);
    // Consecutive count should be 1 (triggered once)
    expect(data?.points.consecutiveFastActions).toBe(1);
  });

  it("should reset penalty after detailed time passed", () => {
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0));
    TrialStorage.init();

    vi.advanceTimersByTime(10000);
    TrialStorage.consumePoints(1); // Normal

    vi.advanceTimersByTime(1000);
    TrialStorage.consumePoints(1); // Normal

    const data = TrialStorage.load();
    expect(data?.points.current).toBe(INITIAL_POINTS - 2);
    expect(data?.points.consecutiveFastActions).toBe(0);
  });
});
