import { and, desc, eq } from "drizzle-orm";

import { db as database } from "./client";
import { notifications } from "./schema.postgres";

export type NotificationType = "system" | "invite" | "transaction" | "event";

export type Notification = {
  id: string;
  user_profile_id: string;
  title: string;
  message: string;
  link_url: string | null;
  type: NotificationType | string | null;
  is_read: boolean | null;
  created_at: string | null;
};

// Mapper Helper
/**
 *
 * @param n
 */
function mapToNotificationDomain(n: unknown): Notification {
  const notif = n as Record<string, unknown>;
  return {
    id: notif.id as string,
    user_profile_id: notif.userProfileId as string,
    title: notif.title as string,
    message: notif.message as string,
    link_url: notif.linkUrl as string | null,
    type: notif.type as string,
    is_read: notif.isRead as boolean,
    created_at: notif.createdAt as string | null,
  };
}

export const createNotification = async (
  notificationData: Partial<Notification>
) => {
  const drizzleInput = {
    userProfileId: notificationData.user_profile_id!,
    title: notificationData.title!,
    message: notificationData.message!,
    linkUrl: notificationData.link_url,
    type: notificationData.type!,
    isRead: false,
  };

  const [newNotification] = await database
    .insert(notifications)
    .values(drizzleInput)
    .returning();
  return mapToNotificationDomain(newNotification);
};

export const getUnreadNotifications = async (userId: string) => {
  const result = await database.query.notifications.findMany({
    where: and(
      eq(notifications.userProfileId, userId),
      eq(notifications.isRead, false)
    ),
    orderBy: [desc(notifications.createdAt)],
  });
  return result.map(mapToNotificationDomain);
};

export const getNotifications = async (
  userId: string,
  limit: number = 20,
  offset: number = 0
) => {
  const result = await database.query.notifications.findMany({
    where: eq(notifications.userProfileId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
    offset,
  });
  return result.map(mapToNotificationDomain);
};

export const getNotificationById = async (notificationId: string) => {
  const result = await database.query.notifications.findFirst({
    where: eq(notifications.id, notificationId),
  });
  return result ? mapToNotificationDomain(result) : undefined;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const [updated] = await database
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationId))
    .returning();
  return mapToNotificationDomain(updated);
};

export const deleteNotification = async (notificationId: string) => {
  const [deleted] = await database
    .delete(notifications)
    .where(eq(notifications.id, notificationId))
    .returning();
  return deleted ? mapToNotificationDomain(deleted) : undefined;
};
