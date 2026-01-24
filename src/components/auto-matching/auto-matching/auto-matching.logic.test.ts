import { describe, it, expect } from "vitest";
import {
  calculateUserScore,
  filterCandidates,
  UserProfile,
} from "./auto-matching.logic";

// Mock Data
const mockTargetProfile: UserProfile = {
  id: "target",
  name: "Target",
  values: ["A", "B"],
  createdWorks: ["Work1"],
  favoriteWorks: ["Fav1"],
  skills: ["Skill1"],
};

const mockCandidate: UserProfile = {
  id: "c1",
  name: "Candidate1",
  values: ["A", "C"], // 1 match
  createdWorks: ["Work1"], // 1 match
  favoriteWorks: [], // 0 match
  skills: ["Skill1", "Skill2"], // 1 match
};

describe("AutoMatching Logic", () => {
  describe("calculateUserScore", () => {
    it("should calculate score correctly based on selected categories", () => {
      // Match in values (1), createdWorks (1), skills (1) -> Total 3 matches * 2 points = 6
      const categories = ["values", "createdWorks", "skills"];
      const result = calculateUserScore(
        mockCandidate,
        mockTargetProfile,
        categories
      );
      expect(result.matchScore).toBe(6);
    });

    it("should return 0 score if no matches", () => {
      const result = calculateUserScore(
        { ...mockCandidate, values: ["Z"], createdWorks: ["Z"], skills: ["Z"] },
        mockTargetProfile,
        ["values", "createdWorks", "skills"]
      );
      expect(result.matchScore).toBe(0);
    });

    it("should ignore categories not selected", () => {
      // Match only in values (1) -> 2 points. createdWorks and skills are ignored.
      const categories = ["values"];
      const result = calculateUserScore(
        mockCandidate,
        mockTargetProfile,
        categories
      );
      expect(result.matchScore).toBe(2);
    });
  });

  describe("filterCandidates", () => {
    const pool: UserProfile[] = [
      {
        id: "c1",
        name: "C1",
        values: ["A"],
        createdWorks: [],
        favoriteWorks: [],
        skills: [],
      }, // Match A (2pts)
      {
        id: "c2",
        name: "C2",
        values: ["A", "B"],
        createdWorks: [],
        favoriteWorks: [],
        skills: [],
      }, // Match A, B (4pts)
      {
        id: "c3",
        name: "C3",
        values: [],
        createdWorks: [],
        favoriteWorks: [],
        skills: [],
      }, // 0pts
    ];

    it("should correctily expand candidates based on count", () => {
      const result = filterCandidates(
        pool,
        [],
        mockTargetProfile,
        ["values"],
        "expand",
        "count",
        2,
        0
      ) as { addedUsers: UserProfile[] };

      expect(result.addedUsers).toHaveLength(2);
      expect(result.addedUsers[0].id).toBe("c2"); // Highest score first
      expect(result.addedUsers[1].id).toBe("c1");
    });

    it("should correctily expand candidates based on score threshold", () => {
      const result = filterCandidates(
        pool,
        [],
        mockTargetProfile,
        ["values"],
        "expand",
        "score",
        0,
        4 // Only C2 has 4 points
      ) as { addedUsers: UserProfile[] };

      expect(result.addedUsers).toHaveLength(1);
      expect(result.addedUsers[0].id).toBe("c2");
    });
  });
});
