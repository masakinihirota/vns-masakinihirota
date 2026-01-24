import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MOCK_DB_WORKS } from "../mock-data";
import { useWorkSearch } from "./use-work-search";

describe("useWorkSearch", () => {
  it("initializes with all works of the default category (manga)", () => {
    const { result } = renderHook(() => useWorkSearch());

    const mangaWorks = MOCK_DB_WORKS.filter((w) => w.category === "manga");
    expect(result.current.dbResults).toHaveLength(mangaWorks.length);
    expect(result.current.dbResults).toEqual(
      expect.arrayContaining(mangaWorks)
    );
  });

  it("updates results when category changes to anime", () => {
    const { result, rerender } = renderHook(() => useWorkSearch());

    act(() => {
      result.current.setCategory("anime");
    });

    // Changing state in render loop (if implemented that way) or effect might need rerender/wait
    // My implementation uses setState in render for category change, so it should be reflected immediately or next render
    rerender();

    const animeWorks = MOCK_DB_WORKS.filter((w) => w.category === "anime");
    expect(result.current.dbResults).toHaveLength(animeWorks.length);
    expect(result.current.dbResults).toEqual(
      expect.arrayContaining(animeWorks)
    );
  });

  it("filters results when searching", async () => {
    const { result } = renderHook(() => useWorkSearch());

    await act(async () => {
      await result.current.handleSearch("鬼滅", "manga");
    });

    // 鬼滅の刃 is in DB
    expect(result.current.dbResults).toHaveLength(1);
    expect(result.current.dbResults[0].title).toBe("鬼滅の刃");
  });

  it("resets to all category works when query is cleared", async () => {
    const { result } = renderHook(() => useWorkSearch());

    // First search something
    await act(async () => {
      await result.current.handleSearch("鬼滅", "manga");
    });
    expect(result.current.dbResults).toHaveLength(1);

    // Then clear query
    await act(async () => {
      await result.current.handleSearch("", "manga");
    });

    const mangaWorks = MOCK_DB_WORKS.filter((w) => w.category === "manga");
    expect(result.current.dbResults).toHaveLength(mangaWorks.length);
  });

  it("paginates results correctly", () => {
    const { result } = renderHook(() => useWorkSearch());

    // Initial load: 50 items
    expect(result.current.displayedResults).toHaveLength(50);
    expect(result.current.hasMore).toBe(true);

    // Load more
    act(() => {
      result.current.loadMore();
    });

    // Should have 100 items (or less if total < 100, but mock data is > 500)
    expect(result.current.displayedResults).toHaveLength(100);
  });

  it("resets pagination when category changes", () => {
    const { result } = renderHook(() => useWorkSearch());

    act(() => {
      result.current.loadMore();
    });
    expect(result.current.displayedResults).toHaveLength(100);

    // Switch category
    act(() => {
      result.current.setCategory("anime");
    });
    // Should reset to 1st page (50 items)
    expect(result.current.displayedResults).toHaveLength(50);
  });
});
