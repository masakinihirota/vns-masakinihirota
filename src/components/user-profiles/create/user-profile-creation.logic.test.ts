import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useUserProfileCreation } from "./user-profile-creation.logic";

describe("useUserProfileCreation", () => {
  it("initial step should be 1", () => {
    const { result } = renderHook(() => useUserProfileCreation());
    expect(result.current.currentStep).toBe(1);
  });

  it("should update form data", () => {
    const { result } = renderHook(() => useUserProfileCreation());

    act(() => {
      result.current.updateForm("displayName", "Test User");
    });

    expect(result.current.formData.displayName).toBe("Test User");
  });

  it("should toggle purpose correctly", () => {
    const { result } = renderHook(() => useUserProfileCreation());
    // Initial purpose is ['create_work']
    expect(result.current.formData.purposes).toContain("create_work");

    // Add 'play'
    act(() => {
      result.current.togglePurpose("play");
    });
    expect(result.current.formData.purposes).toContain("play");
    expect(result.current.formData.purposes).toContain("create_work");

    // Remove 'play'
    act(() => {
      result.current.togglePurpose("play");
    });
    expect(result.current.formData.purposes).not.toContain("play");

    // Cannot remove last item
    act(() => {
      result.current.togglePurpose("create_work");
    });
    expect(result.current.formData.purposes).toContain("create_work");
  });

  it("should add and remove own works", () => {
    const { result } = renderHook(() => useUserProfileCreation());

    act(() => {
      result.current.addOwnWork();
    });

    expect(result.current.formData.ownWorks).toHaveLength(1);
    const newId = result.current.formData.ownWorks[0].id;

    act(() => {
      result.current.updateOwnWork(newId, "title", "My Work");
    });

    expect(result.current.formData.ownWorks[0].title).toBe("My Work");

    act(() => {
      result.current.removeOwnWork(newId);
    });

    expect(result.current.formData.ownWorks).toHaveLength(0);
  });

  it("should handle value selection", () => {
    const { result } = renderHook(() => useUserProfileCreation());
    const questionId = "q1";
    const choiceId = "c1";

    act(() => {
      result.current.handleValueSelection(questionId, choiceId);
    });

    expect(result.current.valueSelections[questionId]).toContain(choiceId);

    act(() => {
      result.current.handleValueSelection(questionId, choiceId);
    });

    expect(result.current.valueSelections[questionId]).not.toContain(choiceId);
  });

  it("should handle value tier toggling", () => {
    const { result } = renderHook(() => useUserProfileCreation());
    const questionId = "q1";

    // Toggle 1 (Heart)
    act(() => {
      result.current.toggleValueTier(questionId);
    });
    expect(result.current.valueTiers[questionId]).toBe(1);

    // Toggle off
    act(() => {
      result.current.toggleValueTier(questionId);
    });
    expect(result.current.valueTiers[questionId]).toBeUndefined();

    // Set specific tier
    act(() => {
      result.current.toggleValueTier(questionId, 2);
    });
    expect(result.current.valueTiers[questionId]).toBe(2);
  });
});
