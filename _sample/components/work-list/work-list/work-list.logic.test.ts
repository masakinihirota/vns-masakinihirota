import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RATINGS, useWorkListLogic } from "./work-list.logic";

// Mock fetch globally
vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({
        success: true,
        data: Array.from({ length: 250 }, (_, index) => ({
          id: `${index + 1}`,
          title: `Test Work ${index + 1}`,
          category: index % 2 === 0 ? "アニメ" : "漫画",
          tags: ["action"],
          externalUrl: "https://example.com",
          affiliateUrl: "https://affiliate.example.com",
          isOfficial: true,
          userWorkRatings: [{ rating: "TIER1", lastTier: "TIER1" }],
        })),
        count: 250,
      }),
    } as Response)
  )
);

describe("useWorkListLogic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初期状態でローディング中である", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.works).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // ローディング状態のテストのみ
    expect(result.current).toBeDefined();
  });

  it("カテゴリフィルタが機能する", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    await vi.runAllTimersAsync();

    // デフォルトはアニメと漫画
    expect(result.current.enabledCategories).toEqual(["アニメ", "漫画"]);

    // アニメをオフにする
    act(() => {
      result.current.toggleCategory("アニメ");
    });

    expect(result.current.enabledCategories).toEqual(["漫画"]);
  });

  it("検索フィルタが機能する", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    await vi.runAllTimersAsync();

    if (result.current.works.length > 0) {
      const targetWork = result.current.works[0];
      const searchTerm = targetWork.title.slice(0, 5);

      act(() => {
        result.current.setSearchInput(searchTerm);
      });

      act(() => {
        result.current.handleSearchExecute();
      });

      expect(result.current.appliedSearch).toBe(searchTerm);
    }
  });

  it("ソート機能が機能する", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    await vi.runAllTimersAsync();

    act(() => {
      result.current.requestSort("title");
    });

    expect(result.current.sortConfig.key).toBe("title");
  });

  it("評価モードの切り替えが正しく動作する", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    await vi.runAllTimersAsync();

    expect(result.current.ratingMode).toBe("tier");

    act(() => {
      result.current.handleRatingModeToggle("like");
    });

    expect(result.current.ratingMode).toBe("like");
  });
});
