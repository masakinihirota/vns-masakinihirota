import { and, desc, eq } from "drizzle-orm";
import type { TablesInsert } from "@/types/types_db";
import { db } from "./drizzle-postgres";
import { notifications } from "./schema.postgres";

export type NotificationType = "system" | "invite" | "transaction" | "event";

type NotificationInsert = TablesInsert<"notifications">;

// Mapper Helper
function mapNotificationToSupabase(n: any): any {
  return {
    id: n.id,
    user_profile_id: n.userProfileId,
    title: n.title,
    message: n.message,
    link_url: n.linkUrl,
    type: n.type,
    is_read: n.isRead,
    created_at: n.createdAt,
  };
}

export const createNotification = async (
  notificationData: NotificationInsert
) => {
  const drizzleInput = {
    userProfileId: notificationData.user_profile_id,
    title: notificationData.title,
    message: notificationData.message,
    linkUrl: notificationData.link_url,
    type: notificationData.type,
    isRead: false,
  };

  const [newNotification] = await db
    .insert(notifications)
    .values(drizzleInput)
    .returning();
  return mapNotificationToSupabase(newNotification);
};

export const getUnreadNotifications = async (userId: string) => {
  const result = await db.query.notifications.findMany({
    where: and(
      eq(notifications.userProfileId, userId),
      eq(notifications.isRead, false)
    ),
    orderBy: [desc(notifications.createdAt)],
  });
  return result.map(mapNotificationToSupabase);
};

export const markNotificationAsRead = async (notificationId: string) => {
  const [updated] = await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId))
    .returning();
  return mapNotificationToSupabase(updated);
};
