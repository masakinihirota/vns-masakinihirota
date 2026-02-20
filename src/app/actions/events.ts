import { auth } from "@/lib/auth/helper";
import * as eventsDb from "@/lib/db/events";
import type { TablesInsert } from "@/types/types_db";

type NationEventInsert = TablesInsert<"nation_events">;

export async function getEventsAction(nationId: string = "all") {
  return eventsDb.getEvents(nationId);
}

export async function createEventAction(eventData: NationEventInsert) {
  return eventsDb.createEvent(eventData);
}

export async function joinEventAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return eventsDb.joinEvent(eventId, session.user.id);
}

export async function cancelEventParticipationAction(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return eventsDb.cancelEventParticipation(eventId, session.user.id);
}

export async function getEventAction(eventId: string) {
  return eventsDb.getEvent(eventId);
}
