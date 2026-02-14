"use server";

import * as eventsDb from "@/lib/db/events";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/types_db";

type NationEventInsert = TablesInsert<"nation_events">;

export async function getEventsAction(nationId: string = "all") {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return eventsDb.getEvents(supabase, nationId);
}

export async function createEventAction(eventData: NationEventInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return eventsDb.createEvent(supabase, eventData);
}

export async function joinEventAction(eventId: string, userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return eventsDb.joinEvent(supabase, eventId, userId);
}

export async function cancelEventParticipationAction(eventId: string, userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return eventsDb.cancelEventParticipation(supabase, eventId, userId);
}

export async function getEventAction(eventId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();

  return eventsDb.getEvent(supabase, eventId);
}
