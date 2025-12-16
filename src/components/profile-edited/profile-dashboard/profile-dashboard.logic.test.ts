import { describe, it, expect } from "vitest";
import {
  filterProfiles,
  createNewProfile,
  duplicateProfile,
  INITIAL_PROFILES,
} from "./profile-dashboard.logic";

describe("ProfileDashboard Logic", () => {
  describe("filterProfiles", () => {
    it("should return all profiles if query is empty", () => {
      const result = filterProfiles(INITIAL_PROFILES, "");
      expect(result).toHaveLength(INITIAL_PROFILES.length);
    });

    it("should filter profiles by name case-insensitive", () => {
      const result = filterProfiles(INITIAL_PROFILES, "alpha");
      expect(result).toHaveLength(1);
      expect(result[0].name).toContain("Alpha");
    });

    it("should filter profiles by handle case-insensitive", () => {
      const result = filterProfiles(INITIAL_PROFILES, "null_ptr");
      expect(result).toHaveLength(1);
      expect(result[0].handle).toBe("@null_ptr");
    });

    it("should return empty array if no match", () => {
      const result = filterProfiles(INITIAL_PROFILES, "xyz123");
      expect(result).toHaveLength(0);
    });
  });

  describe("createNewProfile", () => {
    it("should create a new profile with given attributes", () => {
      const profile = createNewProfile("Test User", "testuser", "Main");
      expect(profile.name).toBe("Test User");
      expect(profile.handle).toBe("@testuser");
      expect(profile.attributes.type).toBe("Main");
      expect(profile.id).toMatch(/^p-\d+$/);
    });

    it("should handle handle with @", () => {
      const profile = createNewProfile("Test", "@test", "Sub");
      expect(profile.handle).toBe("@test");
    });
  });

  describe("duplicateProfile", () => {
    it("should create a copy of the profile with new ID and updated name", () => {
      const original = INITIAL_PROFILES[0];
      const result = duplicateProfile(original);

      expect(result.id).not.toBe(original.id);
      expect(result.name).toBe(`${original.name} (Copy)`);
      expect(result.handle).toBe(original.handle);
      expect(result.attributes).toEqual(original.attributes);
    });
  });
});
