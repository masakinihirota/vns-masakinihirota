import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useOnboarding } from "./onboarding.logic";

describe("useOnboarding", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state.selectedArea).toBeNull();
    expect(result.current.state.culturalSphere).toBe("");
    expect(result.current.state.isAdult).toBe(false);
    expect(result.current.state.canSubmit).toBe(false);
  });

  it("should update selected area", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.actions.setSelectedArea("area1");
    });

    expect(result.current.state.selectedArea).toBe("area1");
  });

  it("should auto-select country when cultural sphere is japanese", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.actions.setCulturalSphere("japanese");
    });

    expect(result.current.state.selectedCountry).toBe("日本");
  });

  it("should toggle available languages", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.actions.toggleAvailableLanguage("English");
    });
    expect(result.current.state.availableLanguages).toContain("English");

    act(() => {
      result.current.actions.toggleAvailableLanguage("English");
    });
    expect(result.current.state.availableLanguages).not.toContain("English");
  });

  it("should validate submission ability", () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state.canSubmit).toBe(false);

    act(() => {
      result.current.actions.setIsAdult(true);
      result.current.actions.toggleAgreement("oasis");
      result.current.actions.toggleAgreement("human");
      result.current.actions.toggleAgreement("honesty");
    });

    expect(result.current.state.canSubmit).toBe(true);
  });
});
