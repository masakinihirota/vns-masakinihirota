import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RATINGS, useWorkListLogic } from "./work-list.logic";

describe("useWorkListLogic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("初期状態でローディング中であり、データ生成後にローディングが完了する", async () => {
    const { result } = renderHook(() => useWorkListLogic());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.works).toEqual([]);

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.works.length).toBe(250);
  });

  it("カテゴリフィルタが機能する", () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // デフォルトはアニメと漫画
    expect(result.current.enabledCategories).toEqual(["アニメ", "漫画"]);

    // アニメをオフにする
    act(() => {
      result.current.toggleCategory("アニメ");
    });

    expect(result.current.enabledCategories).toEqual(["漫画"]);

    // フィルタリング結果の確認（モックデータの生成ロジックに依存）
    const hasAnime = result.current.filteredAndSortedWorks.some(
      (w) => w.category === "アニメ"
    );
    expect(hasAnime).toBe(false);
  });

  it("検索フィルタが機能する", () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    const targetWork = result.current.works[0];
    const searchTerm = targetWork.title.substring(0, 5);

    act(() => {
      result.current.setSearchInput(searchTerm);
    });

    act(() => {
      result.current.handleSearchExecute();
    });

    expect(result.current.appliedSearch).toBe(searchTerm);
    // 検索結果にターゲットが含まれているか
    expect(result.current.filteredAndSortedWorks).toContainEqual(targetWork);
  });

  it("ソート機能が機能する", () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // 評価でソート（降順）
    act(() => {
      result.current.requestSort("userRating");
    });
    // デフォルトascなのでdescにするためもう一度
    act(() => {
      result.current.requestSort("userRating");
    });

    expect(result.current.sortConfig).toEqual({
      key: "userRating",
      direction: "desc",
    });

    const sorted = result.current.filteredAndSortedWorks;
    const firstRating = RATINGS[sorted[0].userRating].weight;
    const secondRating = RATINGS[sorted[1].userRating].weight;

    expect(firstRating).toBeGreaterThanOrEqual(secondRating);
  });

  it("評価モードの切り替えと評価変更が正しく動作する", () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // 最初の作品を選択
    const targetId = result.current.works[0].id; // TIER1

    act(() => {
      result.current.setSelectedWorkId(targetId);
    });

    // Likeモードに切り替え
    act(() => {
      result.current.handleRatingModeToggle("like");
    });

    expect(result.current.ratingMode).toBe("like");
    // Tier1だったものはLike1になるはず
    const workInLikeMode = result.current.works.find((w) => w.id === targetId);
    expect(workInLikeMode?.userRating).toBe("LIKE1");

    // Tierモードに戻す
    act(() => {
      result.current.handleRatingModeToggle("tier");
    });

    expect(result.current.ratingMode).toBe("tier");
    // 元のTierに戻るはず
    const workInTierMode = result.current.works.find((w) => w.id === targetId);
    expect(workInTierMode?.userRating).toBe("TIER1");
  });

  it("Tierモードでの評価変更がlastTierを更新する", () => {
    const { result } = renderHook(() => useWorkListLogic());

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    // TIER1の作品を探す
    const targetWork = result.current.works.find(
      (w) => w.userRating === "TIER1"
    );
    if (!targetWork) throw new Error("Target work not found");

    act(() => {
      result.current.setSelectedWorkId(targetWork.id);
    });

    // TIER2に変更
    act(() => {
      result.current.handleRatingChange("TIER2");
    });

    const updatedWork = result.current.works.find(
      (w) => w.id === targetWork.id
    );
    expect(updatedWork?.userRating).toBe("TIER2");
    expect(updatedWork?.lastTier).toBe("TIER2");
  });
});
