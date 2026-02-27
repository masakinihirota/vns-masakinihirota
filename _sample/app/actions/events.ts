"use server";

import { auth } from "@/lib/auth/helper";
import type { EventStatus } from "@/lib/db/events";
import * as eventsDb from "@/lib/db/events";
import type { NewEvent } from "@/lib/db/types";

type NationEventInsert = NewEvent;

/**
 *
 * @param nationId
 */
export async function getEventsAction(nationId: string = "all") {
  return eventsDb.getEvents(nationId);
}

/**
 *
 * @param eventData
 */
export async function createEventAction(eventData: NationEventInsert) {
  const data = {
    ...eventData,
    status: (eventData.status as EventStatus | null) ?? undefined,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return eventsDb.createEvent(data as any);
}

/**
 *
 * @param eventId
 */
export async function joinEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return eventsDb.joinEvent(eventId, session.user.id);
}

/**
 *
 * @param eventId
 */
export async function cancelEventParticipationAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return eventsDb.cancelEventParticipation(eventId, session.user.id);
}

/**
 *
 * @param eventId
 */
export async function getEventAction(eventId: string) {
  return eventsDb.getEvent(eventId);
}
