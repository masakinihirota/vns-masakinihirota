import { createClient } from "@supabase/supabase-js";
import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createEventDrizzle,
  getEventDrizzle,
  joinEventDrizzle,
} from "@/lib/db/drizzle/events.drizzle";
import { createGroupDrizzle } from "@/lib/db/drizzle/groups.drizzle";
import { createNationDrizzle } from "@/lib/db/drizzle/nations.drizzle";
import { createUserProfileDrizzle } from "@/lib/db/drizzle/user-profiles.drizzle";
import { db } from "@/lib/drizzle/client";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:64321";
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required for integration tests"
  );
}

const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

describe("Events Drizzle DAL Integration", () => {
  let organizerUserId: string;
  let organizerProfileId: string;
  let participantUserId: string;
  let participantProfileId: string;
  let nationId: string;

  const cleanupUser = async (userId: string) => {
    if (userId) await adminClient.auth.admin.deleteUser(userId);
  };

  beforeAll(async () => {
    // 1. Organizer
    const orgEmail = `drizzle-org-${uuidv4()}@example.com`;
    const { data: orgAuth } = await adminClient.auth.admin.createUser({
      email: orgEmail,
      password: "password123",
      email_confirm: true,
    });
    organizerUserId = orgAuth.user!.id;
    await new Promise((r) => setTimeout(r, 500));
    const orgRoot = (
      await db.execute(
        sql`SELECT id FROM root_accounts WHERE auth_user_id = ${organizerUserId}`
      )
    )[0] as { id: string };
    const orgProfile = await createUserProfileDrizzle(orgRoot.id, {
      display_name: "Organizer",
      role_type: "leader",
    });
    organizerProfileId = orgProfile.id;

    // 2. Participant
    const partEmail = `drizzle-part-${uuidv4()}@example.com`;
    const { data: partAuth } = await adminClient.auth.admin.createUser({
      email: partEmail,
      password: "password123",
      email_confirm: true,
    });
    participantUserId = partAuth.user!.id;
    await new Promise((r) => setTimeout(r, 500));
    const partRoot = (
      await db.execute(
        sql`SELECT id FROM root_accounts WHERE auth_user_id = ${participantUserId}`
      )
    )[0] as { id: string };
    const partProfile = await createUserProfileDrizzle(partRoot.id, {
      display_name: "Participant",
      role_type: "member",
    });
    participantProfileId = partProfile.id;

    // 3. Create Group and Nation for Event
    // createNationDrizzle requires owner_group_id, so create a group first
    const orgGroup = await createGroupDrizzle({
      name: `Org Group ${uuidv4()}`,
      leader_id: organizerProfileId,
      description: "Group for Nation",
    });

    try {
      const nation = await createNationDrizzle({
        name: `Nation ${uuidv4()}`,
        description: "Test Nation",
        owner_user_id: organizerProfileId,
        owner_group_id: orgGroup.id,
        foundation_fee: 1000,
        transaction_fee_rate: 10.0,
      });
      nationId = nation.id;
    } catch {
      // Fallback: direct insert if logic fails due to points
      await db.execute(
        sql`UPDATE root_accounts SET points = 10000 WHERE id = ${orgRoot.id}`
      );
      const nation = await createNationDrizzle({
        name: `Nation ${uuidv4()}`,
        description: "Test Nation",
        owner_user_id: organizerProfileId,
        owner_group_id: orgGroup.id,
        foundation_fee: 1000,
        transaction_fee_rate: 10.0,
      });
      nationId = nation.id;
    }
  });

  afterAll(async () => {
    await cleanupUser(organizerUserId);
    await cleanupUser(participantUserId);
  });

  it("should create an event", async () => {
    const event = await createEventDrizzle({
      nation_id: nationId,
      organizer_id: organizerProfileId,
      title: "Drizzle Event",
      start_at: new Date().toISOString(),
      type: "free",
    });

    expect(event).toBeDefined();
    expect(event.title).toBe("Drizzle Event");

    // Verify GET
    const fetched = await getEventDrizzle(event.id);
    expect(fetched.title).toBe("Drizzle Event");
  });

  it("should allow participation", async () => {
    const event = await createEventDrizzle({
      nation_id: nationId,
      organizer_id: organizerProfileId,
      title: "Joinable Event",
      start_at: new Date().toISOString(),
      type: "free",
    });

    const participation = await joinEventDrizzle(
      event.id,
      participantProfileId
    );
    expect(participation.status).toBe("going");
    expect(participation.userProfileId).toBe(participantProfileId);
  });
});
