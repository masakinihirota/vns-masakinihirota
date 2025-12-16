import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useManualMatching, calculateCompatibility, MatchingUser } from "./manual-matching.logic";

describe("Manual Matching Logic", () => {
  describe("calculateCompatibility", () => {
    it("should return 100% when tags are identical", () => {
      const userA: MatchingUser = {
        id: "1",
        name: "A",
        tags: ["music", "art"],
        avatarSrc: "",
        bio: "",
      };
      const userB: MatchingUser = {
        id: "2",
        name: "B",
        tags: ["music", "art"],
        avatarSrc: "",
        bio: "",
      };
      expect(calculateCompatibility(userA, userB)).toBe(100);
    });

    it("should return 0% when no tags match", () => {
      const userA: MatchingUser = { id: "1", name: "A", tags: ["music"], avatarSrc: "", bio: "" };
      const userB: MatchingUser = { id: "2", name: "B", tags: ["sport"], avatarSrc: "", bio: "" };
      expect(calculateCompatibility(userA, userB)).toBe(0);
    });

    it("should return correct percentage for partial matches", () => {
      // 2 matches out of 4 unique combined tags -> Jaccard index or simple overlap?
      // Let's assume simple overlap based on userA's preferences for now, or Jaccard.
      // IF we use Jaccard: Intersection / Union.
      // A: [music, art], B: [music, code]
      // Intersection: [music] (1)
      // Union: [music, art, code] (3)
      // 1/3 = 33% roughly.

      // Let's stick to a simple "shared tags count / max(userA.tags, userB.tags)" or just Jaccard.
      // Let's define the requirement: "Lowest minimum similar values".
      // Jaccard is standard for similarity.
      const userA: MatchingUser = {
        id: "1",
        name: "A",
        tags: ["music", "art"],
        avatarSrc: "",
        bio: "",
      };
      const userB: MatchingUser = {
        id: "2",
        name: "B",
        tags: ["music", "code"],
        avatarSrc: "",
        bio: "",
      };
      // Inter: 1, Union: 3 -> 33

      const score = calculateCompatibility(userA, userB);
      expect(score).toBeGreaterThan(30);
      expect(score).toBeLessThan(40);
    });
  });

  describe("useManualMatching", () => {
    it("should return a list of candidates sorted by compatibility", () => {
      const { result } = renderHook(() => useManualMatching());

      // We expect some dummy candidates to be loaded
      expect(result.current.candidates.length).toBeGreaterThan(0);

      // Check sorting: index 0 should have higher or equal score than index 1
      const firstScore = result.current.candidates[0].compatibility;
      const secondScore = result.current.candidates[1].compatibility;
      expect(firstScore).toBeGreaterThanOrEqual(secondScore);
    });

    it("should toggle watch status", () => {
      const { result } = renderHook(() => useManualMatching());
      const candidateId = result.current.candidates[0].user.id;

      act(() => {
        result.current.toggleWatch(candidateId);
      });

      expect(result.current.candidates[0].isWatched).toBe(true);

      act(() => {
        result.current.toggleWatch(candidateId);
      });

      expect(result.current.candidates[0].isWatched).toBe(false);
    });
  });
});
