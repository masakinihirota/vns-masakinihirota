import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { logger } from "@/lib/logger";

import { db as database } from "./client";
import {
  cancelEventParticipation,
  createEvent,
  getEvent,
  joinEvent,
} from "./events";
import { nationEvents } from "./schema.postgres";

describe("Events Integration (Drizzle)", () => {
  let testUserId: string;
  let testNationId: string;
  let createdEventId: string;

  beforeAll(async () => {
    // Find a user
    const profile = await database.query.userProfiles.findFirst();
    if (!profile) {
      throw new Error(
        "Integration test requires at least one UserProfile in DB."
      );
    }
    testUserId = profile.id;

    // Find a nation
    const nation = await database.query.nations.findFirst();
    if (!nation) {
      throw new Error("Integration test requires at least one Nation in DB.");
    }
    testNationId = nation.id;
    logger.info("Using Test User ID:", { testUserId });
    logger.info("Using Test Nation ID:", { testNationId });
  });

  afterAll(async () => {
    if (createdEventId) {
      try {
        await database
          .delete(nationEvents)
          .where(eq(nationEvents.id, createdEventId));
      } catch {
        logger.warn("Cleanup failed or event already deleted");      }
    }
  });

  it("should create an event", async () => {
    const newEventData = {
      nation_id: testNationId,
      organizer_id: testUserId,
      title: "Integration Test Event",
      description: "Testing Drizzle Events",
      start_at: new Date(Date.now() + 86_400_000).toISOString(), // Tomorrow
      type: "free",
      status: "published" as const,
    };

    // createEvent takes NationEventInsert which expects snake_case.
    const event = await createEvent(newEventData);

    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.title).toBe(newEventData.title);
    expect(event.organizer_id).toBe(testUserId);

    createdEventId = event.id;
  });

  it("should get an event", async () => {
    expect(createdEventId).toBeDefined();
    const event = await getEvent(createdEventId);
    expect(event).toBeDefined();
    expect(event?.id).toBe(createdEventId);
    expect(event?.title).toBe("Integration Test Event");
    // Verify relations
    expect(event?.nation).toBeDefined();
    expect(event?.organizer).toBeDefined();
    expect(event?.organizer?.display_name).toBeDefined();
  });

  it("should join an event", async () => {
    expect(createdEventId).toBeDefined();
    // User joins (as organizer they might be auto-joined? logic usually implies organizer goes?
    // But joinEvent is for participants.
    // Let's rely on joinEvent returning success.

    const participation = await joinEvent(createdEventId, testUserId);
    expect(participation).toBeDefined();
    expect(participation.event_id).toBe(createdEventId);
    expect(participation.user_profile_id).toBe(testUserId);
    expect(participation.status).toBe("going");
  });

  it("should cancel participation", async () => {
    expect(createdEventId).toBeDefined();
    const updated = await cancelEventParticipation(createdEventId, testUserId);
    expect(updated).toBeDefined();
    expect(updated.status).toBe("cancelled");
  });
});
