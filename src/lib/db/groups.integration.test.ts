import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "./drizzle";
import { createGroup, deleteGroup, getGroupById, getGroups, updateGroup } from "./groups";
// We need a valid user ID (leader) to create a group.
// In integration tests, we might need to query an existing user or create a temporary one.
// For now, I'll try to find an existing user or use a hardcoded one if I knew it.
// Better: query users table. But we don't have easy access to public.users?
// We have auth.users in schema but we might not have permission to query it easily via drizzle if not configured?
// Actually schema.ts has authUsers.
// Let's try to fetch one user.

describe("Groups Integration (Drizzle)", () => {
  let testUserId: string;
  let createdGroupId: string;

  beforeAll(async () => {
    // Find a user to be the leader
    // We can use user_profiles to find a user.
    // Or just pick one from Auth.
    // Let's assume there is at least one user in the DB.
    // Note: Validation requires leader_id.

    // This query might fail if user_profiles table is empty or permission denied?
    // But we are using postgres connection string (admin usually).
    // Let's query public.user_profiles via drizzle query builder?
    // Db schema has userProfiles.

    const profile = await db.query.userProfiles.findFirst();
    if (!profile) {
      console.warn("No user profile found. Tests might fail.");
      // We could create one if needed, but that requires cascade with RootAccount and Auth User.
      // Skipping test if no user? Or throwing.
      // Let's throw.
      throw new Error("Integration test requires at least one UserProfile in DB.");
    }
    testUserId = profile.id;
    console.log("Using Test User ID:", testUserId);
  });

  afterAll(async () => {
    // Cleanup if delete failed
    if (createdGroupId) {
      try {
        await deleteGroup(null, createdGroupId);
      } catch (e) {
        console.log("Cleanup failed or group already deleted");
      }
    }
  });

  it("should create a group", async () => {
    const newGroupData = {
      name: "Integration Test Group",
      description: "Created by Vitest Integration Test",
      leader_id: testUserId,
      is_official: false
    };

    const group = await createGroup(null, newGroupData);
    expect(group).toBeDefined();
    expect(group.id).toBeDefined();
    expect(group.name).toBe(newGroupData.name);
    expect(group.leader_id).toBe(testUserId);

    createdGroupId = group.id;
  });

  it("should get a group by ID", async () => {
    expect(createdGroupId).toBeDefined();
    const group = await getGroupById(null, createdGroupId);
    expect(group).toBeDefined();
    expect(group?.id).toBe(createdGroupId);
    expect(group?.name).toBe("Integration Test Group");
  });

  it("should list groups", async () => {
    const list = await getGroups(null, 10);
    expect(list).toBeDefined();
    expect(Array.isArray(list)).toBe(true);
    const found = list?.find(g => g.id === createdGroupId);
    expect(found).toBeDefined();
  });

  it("should update a group", async () => {
    expect(createdGroupId).toBeDefined();
    const updateData = {
      description: "Updated Description"
    };
    const updated = await updateGroup(null, createdGroupId, updateData);
    expect(updated).toBeDefined();
    expect(updated?.description).toBe("Updated Description");

    // Verify fetch
    const fetched = await getGroupById(null, createdGroupId);
    expect(fetched?.description).toBe("Updated Description");
  });

  it("should delete a group", async () => {
    expect(createdGroupId).toBeDefined();
    await deleteGroup(null, createdGroupId);

    const fetched = await getGroupById(null, createdGroupId);
    expect(fetched).toBeNull();
    createdGroupId = ""; // Mark as deleted
  });
});
