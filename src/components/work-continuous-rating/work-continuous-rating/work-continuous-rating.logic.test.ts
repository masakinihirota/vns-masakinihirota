import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  loadAnimeData,
  loadMangaData,
  getRatingsFromStorage,
  saveRatingsToStorage,
  Rating,
} from "./work-continuous-rating.logic";

// Fetchのモック
global.fetch = vi.fn();

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

Object.defineProperty(window, "localStorage", {
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
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockData,
      });

      const result = await loadAnimeData();
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith("/anime_titles.json");
    });

    it("should throw error on fetch failure", async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
      });

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
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: async () => mockText,
      });

      const result = await loadMangaData();
      // " - "を含む行のみ、" - "の前を抽出
      expect(result).toEqual(["Manga 1"]);
      expect(global.fetch).toHaveBeenCalledWith("/manga.md");
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
        "Title 1": { status: "Now", value: "Tier1" },
        "Title 2": { status: "Future", value: "Tier3" },
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
