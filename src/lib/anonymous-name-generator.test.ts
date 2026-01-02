import { describe, it, expect } from "vitest";
import {
  generateAnonymousName,
  generateUniqueCandidates,
} from "./anonymous-name-generator";

describe("generateAnonymousName", () => {
  it("generates name correctly for Japanese zodiac input", () => {
    const name = generateAnonymousName("獅子座");
    // Should match pattern: [Color][Material]の[Zodiac]
    // We check for suffix "の獅子座" and non-empty prefix
    expect(name).toMatch(/.+の獅子座$/);
  });

  it("translates English key and generates name", () => {
    const name = generateAnonymousName("leo");
    expect(name).toMatch(/.+の獅子座$/);
  });

  it("handles case insensitive keys", () => {
    const name = generateAnonymousName("Leo");
    expect(name).toMatch(/.+の獅子座$/);
  });

  it("handles another zodiac (aries -> 牡羊座)", () => {
    const name = generateAnonymousName("aries");
    expect(name).toMatch(/.+の牡羊座$/);
  });

  it("returns input as fallback if invalid zodiac", () => {
    expect(generateAnonymousName("InvalidZodiac")).toBe("InvalidZodiac");
  });
});

describe("generateUniqueCandidates", () => {
  it("generates specified number of candidates", () => {
    const candidates = generateUniqueCandidates("leo", 3);
    expect(candidates).toHaveLength(3);
    candidates.forEach((c) => expect(c).toMatch(/.+の獅子座$/));
  });

  it("excludes names in the exclusion list", () => {
    // Generate one name first to use as exclusion
    const excludeName = generateAnonymousName("leo");
    // Try to generate 3 candidates excluding that one
    // Note: Probability of collision is low but possible, verifying logic is sound
    const candidates = generateUniqueCandidates("leo", 3, [excludeName]);
    expect(candidates).not.toContain(excludeName);
  });

  it("ensures candidates within the generated batch are unique", () => {
    const candidates = generateUniqueCandidates("leo", 5);
    const uniqueCandidates = new Set(candidates);
    expect(uniqueCandidates.size).toBe(candidates.length);
  });
});
