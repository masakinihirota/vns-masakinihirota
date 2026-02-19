import { describe, expect, it } from "vitest";
import { calculateSyncLevel, generateComparisonData, Profile } from "./comparison.logic";

describe("Comparison Logic", () => {
  const mockMe: Profile = {
    id: "me",
    name: "Me",
    role: "Tester",
    values: [],
    ratings: {
      "Work A": "T1",
      "Work B": "T2",
    },
  };

  const mockTarget: Profile = {
    id: "target",
    name: "Target",
    role: "Target",
    values: [],
    ratings: {
      "Work A": "T1",
      "Work C": "T1",
    },
  };

  describe("calculateSyncLevel", () => {
    it("比較対象がいない場合は 0 を返す", () => {
      expect(calculateSyncLevel(mockMe, null)).toBe(0);
    });

    it("ティアが完全に一致する場合、加点される", () => {
      // 基礎点 60 + (一致1作品 * 15) = 75
      expect(calculateSyncLevel(mockMe, mockTarget)).toBe(75);
    });

    it("最大値が 99% に制限される", () => {
      const perfectMatch: Profile = {
        ...mockMe,
        ratings: {
          "Work A": "T1",
          "Work B": "T2",
          "Work C": "T3",
          "Work D": "NORMAL",
        },
      };
      // 60 + (4 * 15) = 120 -> 99
      expect(calculateSyncLevel(perfectMatch, perfectMatch)).toBe(99);
    });
  });

  describe("generateComparisonData", () => {
    it("自分と相手の作品がマージされる", () => {
      const filters = {
        tier: { T1: true, T2: true, T3: true, NORMAL: true, INTERESTLESS: true, UNRATED: true },
        cat: { MANGA: true, MOVIE: true, OTHER: true },
        temporal: { LIFE: true, PRESENT: true, FUTURE: true },
      };
      const data = generateComparisonData(mockMe, mockTarget, { key: "title", direction: "asc" }, filters);

      const titles = data.map(d => d.title);
      expect(titles).toContain("Work A");
      expect(titles).toContain("Work B");
      expect(titles).toContain("Work C");
    });

    it("フィルタによって除外される作品がある", () => {
      const filters = {
        tier: { T1: false, T2: true, T3: true, NORMAL: true, INTERESTLESS: true, UNRATED: true },
        cat: { MANGA: true, MOVIE: true, OTHER: true },
        temporal: { LIFE: true, PRESENT: true, FUTURE: true },
      };
      const data = generateComparisonData(mockMe, mockTarget, { key: "title", direction: "asc" }, filters);

      const titles = data.map(d => d.title);
      expect(titles).not.toContain("Work A"); // T1 なので除外
      expect(titles).toContain("Work B"); // T2 なので残る
    });
  });
});
