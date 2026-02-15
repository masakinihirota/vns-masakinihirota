"use server";

import * as eventsDb from "@/lib/db/events";
import type { TablesInsert } from "@/types/types_db";

type NationEventInsert = TablesInsert<"nation_events">;

export async function getEventsAction(nationId: string = "all") {
  return eventsDb.getEvents(nationId);
}

export async function createEventAction(eventData: NationEventInsert) {
  return eventsDb.createEvent(eventData);
}

export async function joinEventAction(eventId: string, userId: string) {
  return eventsDb.joinEvent(eventId, userId);
}

export async function cancelEventParticipationAction(eventId: string, userId: string) {
  return eventsDb.cancelEventParticipation(eventId, userId);
}

export async function getEventAction(eventId: string) {
  return eventsDb.getEvent(eventId);
}
