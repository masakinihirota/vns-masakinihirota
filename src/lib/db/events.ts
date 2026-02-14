import { Database } from "@/types/database.types";
import type { Tables, TablesInsert } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { nationEventParticipants, nationEvents } from "./schema";

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

export const getEvents = async (
  supabase: SupabaseClient<Database> | null,
  nationId: string = "all"
) => {
  if (process.env.USE_DRIZZLE === "true") {
    let whereClause = eq(nationEvents.status, "published");

    if (nationId && nationId !== "all") {
      whereClause = and(whereClause, eq(nationEvents.nationId, nationId))!;
    }

    const events = await db.query.nationEvents.findMany({
      where: whereClause,
      orderBy: [asc(nationEvents.startAt)]
    });

    return events.map(mapEventToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  let query = supabase
    .from("nation_events")
    .select("*")
    .eq("status", "published");

  if (nationId && nationId !== "all") {
    query = query.eq("nation_id", nationId);
  }

  const { data, error } = await query.order("start_at", { ascending: true });
  if (error) throw error;
  return data;
}

export const createEvent = async (
  supabase: SupabaseClient<Database> | null,
  eventData: NationEventInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nation_events")
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinEvent = async (
  supabase: SupabaseClient<Database> | null,
  eventId: string,
  userId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nation_event_participants")
    .insert({ event_id: eventId, user_profile_id: userId, status: "going" })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelEventParticipation = async (
  supabase: SupabaseClient<Database> | null,
  eventId: string,
  userId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nation_event_participants")
    .update({ status: "cancelled" })
    .eq("event_id", eventId)
    .eq("user_profile_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEvent = async (
  supabase: SupabaseClient<Database> | null,
  eventId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
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
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("nation_events")
    .select(`
      *,
      nation:nations(*),
      organizer:user_profiles(*)
    `)
    .eq("id", eventId)
    .single();

  if (error) throw error;
  return data;
};
