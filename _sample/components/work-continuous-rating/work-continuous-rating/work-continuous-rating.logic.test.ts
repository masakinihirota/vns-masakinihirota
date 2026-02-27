import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getRatingsFromStorage,
  loadAnimeData,
  loadMangaData,
  Rating,
  saveRatingsToStorage,
} from "./work-continuous-rating.logic";

// Fetchのモック
globalThis.fetch = vi.fn();

// LocalStorageのモック
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

describe("work-continuous-rating.logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe("loadAnimeData", () => {
    it("should load and parse anime data", async () => {
      const mockData = ["Anime 1", "Anime 2"];
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await loadAnimeData();
      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith("/anime_titles.json");
    });

    it("should throw error on fetch failure", async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(loadAnimeData()).rejects.toThrow(
        "Failed to load anime data"
      );
    });
  });

  describe("loadMangaData", () => {
    it("should load and parse manga data", async () => {
      const mockText = `
### Title
Manga 1 - Author
Manga 2
      `;
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        text: async () => mockText,
      } as unknown as Response);

      const result = await loadMangaData();
      // " - "を含む行のみ、" - "の前を抽出
      expect(result).toEqual(["Manga 1"]);
      expect(globalThis.fetch).toHaveBeenCalledWith("/manga.md");
    });
  });

  describe("Storage", () => {
    it("should save and retrieve ratings (string format)", () => {
      const ratings: Record<string, Rating> = { "Title 1": "Tier1" };
      saveRatingsToStorage("anime", ratings, "test");

      const retrieved = getRatingsFromStorage("anime", "test");
      expect(retrieved).toEqual(ratings);
    });

    it("should save and retrieve ratings (object format)", () => {
      const ratings: Record<string, Rating> = {
        "Title 1": {
          status: "Now",
          isLiked: true,
          tier: "Tier1",
          otherValue: null,
        },
        "Title 2": {
          status: "Future",
          isLiked: true,
          tier: "Tier3",
          otherValue: null,
        },
      };
      saveRatingsToStorage("anime", ratings, "test-obj");

      const retrieved = getRatingsFromStorage("anime", "test-obj");
      expect(retrieved).toEqual(ratings);
    });

    it("should return empty object if no data", () => {
      const retrieved = getRatingsFromStorage("manga", "empty");
      expect(retrieved).toEqual({});
    });
  });
});
