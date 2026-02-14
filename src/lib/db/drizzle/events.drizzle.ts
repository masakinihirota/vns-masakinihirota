import { db } from "@/lib/drizzle/client";
import { nationEventParticipants, nationEvents } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";

/** Drizzle版: イベント作成 */
export const createEventDrizzle = async (eventData: {
  nation_id: string;
  organizer_id: string;
  title: string;
  description?: string;
  image_url?: string;
  start_at: string;
  end_at?: string;
  max_participants?: number;
  type: "free" | "product_required" | "other";
}) => {
  const result = await db
    .insert(nationEvents)
    .values({
      nationId: eventData.nation_id,
      organizerId: eventData.organizer_id,
      title: eventData.title,
      description: eventData.description,
      imageUrl: eventData.image_url,
      startAt: new Date(eventData.start_at),
      endAt: eventData.end_at ? new Date(eventData.end_at) : null,
      maxParticipants: eventData.max_participants,
      type: eventData.type,
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to create event");
  return result[0];
};

/** Drizzle版: イベント参加 */
export const joinEventDrizzle = async (eventId: string, userId: string) => {
  const result = await db
    .insert(nationEventParticipants)
    .values({
      eventId,
      userProfileId: userId,
      status: "going",
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to join event");
  return result[0];
};

/** Drizzle版: イベント参加キャンセル */
export const cancelEventParticipationDrizzle = async (
  eventId: string,
  userId: string
) => {
  const result = await db
    .update(nationEventParticipants)
    .set({ status: "cancelled" })
    .where(eq(nationEventParticipants.eventId, eventId))
    .returning();

  // 該当のuser_profile_idでフィルタ（Drizzleは複合WHERE未サポートのため追加チェック）
  const filtered = result.filter((r) => r.userProfileId === userId);
  if (filtered.length === 0) throw new Error("Participant not found");
  return filtered[0];
};

/** Drizzle版: イベント詳細取得（リレーション付き） */
export const getEventDrizzle = async (eventId: string) => {
  // Drizzleのリレーショナルクエリで取得
  const result = await db.query.nationEvents.findFirst({
    where: eq(nationEvents.id, eventId),
    with: {
      nation: true,
      organizer: true,
    },
  });

  if (!result) throw new Error("Event not found");
  return result;
};
