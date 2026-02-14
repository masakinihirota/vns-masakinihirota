import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "./drizzle";
import { userProfiles } from "./schema";
import { createUserProfile, getUserProfileById, getUserProfiles } from "./user-profiles";

describe("User Profiles Integration (Drizzle)", () => {
  let testRootAccountId: string;
  let createdProfileId: string;

  beforeAll(async () => {
    // Find a root account.
    // We can find a user profile and get its rootAccountId.
    const profile = await db.query.userProfiles.findFirst();
    if (!profile) {
      throw new Error("Integration test requires at least one UserProfile in DB.");
    }
    testRootAccountId = profile.rootAccountId;
    console.log("Using Test Root Account ID:", testRootAccountId);
  });

  afterAll(async () => {
    if (createdProfileId) {
      try {
        await db.delete(userProfiles).where(eq(userProfiles.id, createdProfileId));
      } catch (e) {
        console.log("Cleanup failed or profile already deleted");
      }
    }
  });

  it("should list user profiles", async () => {
    const list = await getUserProfiles(testRootAccountId);
    expect(list).toBeDefined();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("should create a user profile", async () => {
    // Check limit first
    const current = await getUserProfiles(testRootAccountId);
    if (current.length >= 10) {
      console.warn("Skipping create test due to limit reached");
      return;
    }

    const newProfileData = {
      display_name: "Integration Test Profile",
      role_type: "member" as const,
      purpose: "Testing Drizzle Profiles"
    };

    const profile = await createUserProfile(testRootAccountId, newProfileData);

    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    expect(profile.display_name).toBe(newProfileData.display_name);
    expect(profile.root_account_id).toBe(testRootAccountId);

    createdProfileId = profile.id;
  });

  it("should get a user profile by ID", async () => {
    if (!createdProfileId) return; // Skip if create skipped

    const profile = await getUserProfileById(createdProfileId);
    expect(profile).toBeDefined();
    expect(profile?.id).toBe(createdProfileId);
    expect(profile?.display_name).toBe("Integration Test Profile");
  });
});
