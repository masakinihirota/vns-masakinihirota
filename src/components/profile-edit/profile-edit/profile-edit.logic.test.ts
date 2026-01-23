import { describe, it, expect } from "vitest";
import { createInitialProfile } from "./profile-edit.logic";

describe("ProfileEdit Logic", () => {
  it("createInitialProfile should return a default profile", () => {
    const profile = createInitialProfile();
    expect(profile.name).toBe("New User");
    expect(profile.stats.works).toBe(0);
  });
});
