import type { Tables, TablesInsert } from "@/types/types_db";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./drizzle-postgres";
import { nationEventParticipants, nationEvents } from "./schema.postgres";

type NationEvent = Tables<"nation_events">;
type NationEventInsert = TablesInsert<"nation_events">;

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type ParticipantStatus = "going" | "cancelled" | "waitlist";

// Mapper Helpers
function mapEventToSupabase(e: any): NationEvent {
  return {
    id: e.id,
    nation_id: e.nationId,
    organizer_id: e.organizerId,
    title: e.title,
    description: e.description,
    image_url: e.imageUrl,
    start_at: e.startAt,
    end_at: e.endAt,
    recruitment_start_at: e.recruitmentStartAt,
    recruitment_end_at: e.recruitmentEndAt,
    max_participants: e.maxParticipants,
    conditions: e.conditions,
    sponsors: e.sponsors,
    type: e.type,
    status: e.status,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  } as NationEvent;
}

export const getEvents = async (nationId: string = "all") => {
  let whereClause = eq(nationEvents.status, "published");

  if (nationId && nationId !== "all") {
    whereClause = and(whereClause, eq(nationEvents.nationId, nationId))!;
  }

  const events = await db.query.nationEvents.findMany({
    where: whereClause,
    orderBy: [asc(nationEvents.startAt)]
  });

  return events.map(mapEventToSupabase);
};

export const createEvent = async (eventData: NationEventInsert) => {
  const drizzleInput = {
    nationId: eventData.nation_id,
    organizerId: eventData.organizer_id,
    title: eventData.title,
    description: eventData.description,
    imageUrl: eventData.image_url,
    startAt: eventData.start_at,
    endAt: eventData.end_at,
    recruitmentStartAt: eventData.recruitment_start_at,
    recruitmentEndAt: eventData.recruitment_end_at,
    maxParticipants: eventData.max_participants,
    conditions: eventData.conditions,
    sponsors: eventData.sponsors,
    type: eventData.type,
    status: eventData.status ?? "draft",
  };
  const [newEvent] = await db.insert(nationEvents).values(drizzleInput).returning();
  return mapEventToSupabase(newEvent);
};

export const joinEvent = async (
  eventId: string,
  userId: string
) => {
  const [participant] = await db.insert(nationEventParticipants).values({
    eventId,
    userProfileId: userId,
    status: "going"
  }).returning();

  return {
    event_id: participant.eventId,
    user_profile_id: participant.userProfileId,
    status: participant.status,
    joined_at: participant.joinedAt
  };
};

export const cancelEventParticipation = async (
  eventId: string,
  userId: string
) => {
  const [updated] = await db.update(nationEventParticipants)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(nationEventParticipants.eventId, eventId),
        eq(nationEventParticipants.userProfileId, userId)
      )
    ).returning();

  return {
    event_id: updated.eventId,
    user_profile_id: updated.userProfileId,
    status: updated.status,
    joined_at: updated.joinedAt
  };
};

export const getEvent = async (eventId: string) => {
  const event = await db.query.nationEvents.findFirst({
    where: eq(nationEvents.id, eventId),
    with: {
      nation: true,
      userProfile: true,
    }
  });

  if (!event) return null;

  const mapped = mapEventToSupabase(event);

  return {
    ...mapped,
    nation: event.nation ? { ...event.nation, created_at: event.nation.createdAt } : null,
    organizer: event.userProfile ? {
      ...event.userProfile,
      display_name: event.userProfile.displayName,
    } : null
  };
};
