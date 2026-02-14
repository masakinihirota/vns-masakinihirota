import { db } from "@/lib/drizzle/client";
import { notifications } from "@/lib/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";

type NotificationType = "system" | "invite" | "transaction" | "event";

/** Drizzle版: 通知作成 */
export const createNotificationDrizzle = async (notificationData: {
  user_profile_id: string;
  title: string;
  message: string;
  link_url?: string;
  type: NotificationType;
}) => {
  const result = await db
    .insert(notifications)
    .values({
      userProfileId: notificationData.user_profile_id,
      title: notificationData.title,
      message: notificationData.message,
      linkUrl: notificationData.link_url,
      type: notificationData.type,
    })
    .returning();

  if (result.length === 0) throw new Error("Failed to create notification");
  return result[0];
};

/** Drizzle版: 未読通知取得 */
export const getUnreadNotificationsDrizzle = async (userId: string) => {
  return db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userProfileId, userId),
        eq(notifications.isRead, false)
      )
    )
    .orderBy(desc(notifications.createdAt));
};

/** Drizzle版: 通知既読化 */
export const markNotificationAsReadDrizzle = async (notificationId: string) => {
  const result = await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId))
    .returning();

  if (result.length === 0) throw new Error("Notification not found");
  return result[0];
};
