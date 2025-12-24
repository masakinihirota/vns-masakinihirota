import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSchrodingerProfile, PERSONAS } from "./user-profile.logic";

describe("useSchrodingerProfile", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with "unobserved" state', () => {
    const { result } = renderHook(() => useSchrodingerProfile());
    expect(result.current.quantumState).toBe("unobserved");
    expect(result.current.currentPersona).toBeNull();
  });

  it('should transition to "observing" then "collapsed" when observe is called', () => {
    const { result } = renderHook(() => useSchrodingerProfile());

    act(() => {
      result.current.observe();
    });

    expect(result.current.quantumState).toBe("observing");

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.quantumState).toBe("collapsed");
    // Should default to first persona if none selected
    expect(result.current.currentPersona).toEqual(PERSONAS[0]);
  });

  it("should switch masks correctly", () => {
    const { result } = renderHook(() => useSchrodingerProfile());

    // Initial observation
    act(() => {
      result.current.observe();
      vi.advanceTimersByTime(800);
    });

    // Switch to second mask
    const targetPersona = PERSONAS[1];

    act(() => {
      result.current.switchMask(targetPersona.id);
    });

    // Should briefly go back to observing (glitch effect)
    expect(result.current.quantumState).toBe("observing");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.quantumState).toBe("collapsed");
    expect(result.current.currentPersona).toEqual(targetPersona);
  });
});
