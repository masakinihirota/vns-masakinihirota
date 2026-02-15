import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "./drizzle-postgres";
import { createNation, getNationById, getNations } from "./nations";
import { nations } from "./schema.postgres";

describe("Nations Integration (Drizzle)", () => {
  let testUserId: string;
  let createdNationId: string;

  beforeAll(async () => {
    // Find a user to be the owner
    const profile = await db.query.userProfiles.findFirst();
    if (!profile) {
      throw new Error(
        "Integration test requires at least one UserProfile in DB."
      );
    }
    testUserId = profile.id;
    console.log("Using Test User ID:", testUserId);
  });

  afterAll(async () => {
    if (createdNationId) {
      try {
        await db.delete(nations).where(eq(nations.id, createdNationId));
      } catch (e) {
        console.log("Cleanup failed or nation already deleted");
      }
    }
  });

  it("should create a nation", async () => {
    const newNationData = {
      name: "Integration Test Nation",
      description: "Testing Drizzle Nations",
      owner_user_id: testUserId,
      transaction_fee_rate: 0.05,
      foundation_fee: 1000,
      is_official: false,
      // owner_group_id is optional/nullable based on my assumption in logic.ts, let's verify.
      // If it fails, we know we need it.
    };

    const nation = await createNation(newNationData as any);

    expect(nation).toBeDefined();
    expect(nation.id).toBeDefined();
    expect(nation.name).toBe(newNationData.name);
    expect(nation.owner_user_id).toBe(testUserId);

    createdNationId = nation.id;
  });

  it("should get a nation by ID", async () => {
    expect(createdNationId).toBeDefined();
    const nation = await getNationById(createdNationId);
    expect(nation).toBeDefined();
    expect(nation?.id).toBe(createdNationId);
    expect(nation?.name).toBe("Integration Test Nation");
  });

  it("should list nations", async () => {
    const list = await getNations(10);
    expect(list).toBeDefined();
    expect(Array.isArray(list)).toBe(true);
    const found = list?.find((n) => n.id === createdNationId);
    expect(found).toBeDefined();
  });
});
