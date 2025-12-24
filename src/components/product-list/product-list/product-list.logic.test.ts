import { describe, it, expect } from "vitest";
import {
  filterArtworks,
  sortArtworks,
  MOCK_ARTWORKS,
} from "./product-list.logic";

describe("ProductList Logic", () => {
  describe("filterArtworks", () => {
    it("すべての場合、全件返す", () => {
      const result = filterArtworks(MOCK_ARTWORKS, { rating: "すべて" });
      expect(result).toHaveLength(MOCK_ARTWORKS.length);
    });

    it("Tier1でフィルタリングできる", () => {
      const result = filterArtworks(MOCK_ARTWORKS, { rating: "Tier1" });
      expect(result.every((a) => a.rating === "Tier1")).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("sortArtworks", () => {
    it("ratingの昇順でソートできる", () => {
      const result = sortArtworks(MOCK_ARTWORKS, {
        key: "rating",
        order: "asc",
      });
      expect(result[0].rating).toBe("Tier1");
      // 先頭がTier1であることを確認（Tier1は複数あるので、少なくとも最初の要素はTier1）
    });

    it("ratingの降順でソートできる", () => {
      const result = sortArtworks(MOCK_ARTWORKS, {
        key: "rating",
        order: "desc",
      });
      const lastItem = result[0];
      // MOCK_ARTWORKSの中で一番低い評価は "普通or自分に合わない" (4)
      expect(lastItem.rating).toBe("普通or自分に合わない");
    });

    it("titleでソートできる", () => {
      const result = sortArtworks(MOCK_ARTWORKS, {
        key: "title",
        order: "asc",
      });
      // "ゲルニカ", "モナ・リザ", "最後の晩餐", "星月夜", "睡蓮" ... 日本語ソート順によるが
      // 少なくともソート前後で順序が変わるか、あるいは期待した順序になっているか
      // ここでは具体的な期待値と比較する
      const titles = result.map((a) => a.title);
      expect(titles).toEqual(
        [...titles].sort((a, b) => a.localeCompare(b, "ja"))
      );
    });

    it("target_ageでソートできる", () => {
      const result = sortArtworks(MOCK_ARTWORKS, {
        key: "target_age",
        order: "desc",
      });
      // 18+ が先頭に来るはず
      expect(result[0].target_age).toBe("18+");
    });
  });
});
