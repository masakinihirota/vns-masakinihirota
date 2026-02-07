import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useGroupLogic } from "./groups.logic";
import { MOCK_MEMBERS } from "./groups.mock";

describe("useGroupLogic", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useGroupLogic());
    expect(result.current.searchQuery).toBe("");
    // Defaults to MOCK_MEMBERS[1] as per spec/mock impl
    expect(result.current.selectedMember.id).toBe(MOCK_MEMBERS[1].id);
  });

  it("should update search query", () => {
    const { result } = renderHook(() => useGroupLogic());
    act(() => {
      result.current.setSearchQuery("test");
    });
    expect(result.current.searchQuery).toBe("test");
  });

  it("should identify self comparison", () => {
    const { result } = renderHook(() => useGroupLogic());
    act(() => {
      result.current.setSelectedMember(MOCK_MEMBERS[0]);
    });
    expect(result.current.isComparingSelf).toBe(true);
  });
});
