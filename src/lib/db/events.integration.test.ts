import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "./drizzle";
import { cancelEventParticipation, createEvent, getEvent, joinEvent } from "./events";
import { nationEvents } from "./schema";

describe("Events Integration (Drizzle)", () => {
  let testUserId: string;
  let testNationId: string;
  let createdEventId: string;

  beforeAll(async () => {
    // Find a user
    const profile = await db.query.userProfiles.findFirst();
    if (!profile) {
      throw new Error("Integration test requires at least one UserProfile in DB.");
    }
    testUserId = profile.id;

    // Find a nation
    const nation = await db.query.nations.findFirst();
    if (!nation) {
      throw new Error("Integration test requires at least one Nation in DB.");
    }
    testNationId = nation.id;
    console.log("Using Test User ID:", testUserId);
    console.log("Using Test Nation ID:", testNationId);
  });

  afterAll(async () => {
    if (createdEventId) {
      try {
        await db.delete(nationEvents).where(eq(nationEvents.id, createdEventId));
      } catch (e) {
        console.log("Cleanup failed or event already deleted");
      }
    }
  });

  it("should create an event", async () => {
    const newEventData = {
      nation_id: testNationId,
      organizer_id: testUserId,
      title: "Integration Test Event",
      description: "Testing Drizzle Events",
      start_at: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      type: "free",
      status: "published"
    };


    // createEvent takes NationEventInsert which expects snake_case.
    const event = await createEvent(null, newEventData);

    expect(event).toBeDefined();
    expect(event.id).toBeDefined();
    expect(event.title).toBe(newEventData.title);
    expect(event.organizer_id).toBe(testUserId);

    createdEventId = event.id;
  });

  it("should get an event", async () => {
    expect(createdEventId).toBeDefined();
    const event = await getEvent(null, createdEventId);
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

    const participation = await joinEvent(null, createdEventId, testUserId);
    expect(participation).toBeDefined();
    expect(participation.event_id).toBe(createdEventId);
    expect(participation.user_profile_id).toBe(testUserId);
    expect(participation.status).toBe("going");
  });

  it("should cancel participation", async () => {
    expect(createdEventId).toBeDefined();
    const updated = await cancelEventParticipation(null, createdEventId, testUserId);
    expect(updated).toBeDefined();
    expect(updated.status).toBe("cancelled");
  });
});
