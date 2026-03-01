import type { InferSelectModel } from "drizzle-orm";
import { and, asc, eq } from "drizzle-orm";

import { db as database } from "./client";
import { nationEventParticipants, nationEvents } from "./schema.postgres";

// Drizzle型定義
type NationEventsRow = InferSelectModel<typeof nationEvents>;

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type ParticipantStatus = "going" | "cancelled" | "waitlist";

export type NationEvent = {
  id: string;
  nation_id: string | null;
  organizer_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  start_at: string | null;
  end_at: string | null;
  recruitment_start_at: string | null;
  recruitment_end_at: string | null;
  max_participants: number | null;
  conditions: unknown | null;
  sponsors: unknown | null;
  type: string | null;
  status: EventStatus | null;
  created_at: string;
  updated_at: string;
};

// Mapper Helpers
/**
 *
 * @param e
 */
function mapToEventDomain(e: NationEventsRow): NationEvent {
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
    status: e.status as EventStatus,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
}

export const getEvents = async (nationId: string = "all") => {
  let whereClause = eq(nationEvents.status, "published");

  if (nationId && nationId !== "all") {
    // @ts-expect-error drizzle where clause typing
    whereClause = and(whereClause, eq(nationEvents.nationId, nationId));
  }

  const events = await database.query.nationEvents.findMany({
    where: whereClause,
    orderBy: [asc(nationEvents.startAt)],
  });

  return events.map(mapToEventDomain);
};

export const createEvent = async (eventData: Partial<NationEvent>) => {
  const drizzleInput: Record<string, unknown> = {
    nationId: eventData.nation_id!,
    organizerId: eventData.organizer_id!,
    title: eventData.title!,
    description: eventData.description,
    imageUrl: eventData.image_url,
    startAt: eventData.start_at!,
    endAt: eventData.end_at!,
    recruitmentStartAt: eventData.recruitment_start_at,
    recruitmentEndAt: eventData.recruitment_end_at,
    maxParticipants: eventData.max_participants,
    conditions: eventData.conditions,
    sponsors: eventData.sponsors,
    type: eventData.type,
    isPublished: true, // Auto-publish for now
  } as Record<string, unknown>;
  const [newEvent] = await database
    .insert(nationEvents)
    .values(drizzleInput as typeof nationEvents.$inferInsert)
    .returning();
  return mapToEventDomain(newEvent);
};

export const joinEvent = async (eventId: string, userId: string) => {
  const [participant] = await database
    .insert(nationEventParticipants)
    .values({
      eventId,
      userProfileId: userId,
      status: "going",
    })
    .returning();

  return {
    event_id: participant.eventId,
    user_profile_id: participant.userProfileId,
    status: participant.status,
    joined_at: participant.joinedAt,
  };
};

export const cancelEventParticipation = async (
  eventId: string,
  userId: string
) => {
  const [updated] = await database
    .update(nationEventParticipants)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(nationEventParticipants.eventId, eventId),
        eq(nationEventParticipants.userProfileId, userId)
      )
    )
    .returning();

  return {
    event_id: updated.eventId,
    user_profile_id: updated.userProfileId,
    status: updated.status,
    joined_at: updated.joinedAt,
  };
};

export const getEvent = async (eventId: string) => {
  const event = await database.query.nationEvents.findFirst({
    where: eq(nationEvents.id, eventId),
    with: {
      nation: true,
      userProfile: true,
    },
  });

  if (!event) return null;

  const mapped = mapToEventDomain(event);

  return {
    ...mapped,
    nation: event.nation
      ? { ...event.nation, created_at: event.nation.createdAt }
      : null,
    organizer: event.userProfile
      ? {
        ...event.userProfile,
        display_name: event.userProfile.displayName,
      }
      : null,
  };
};
