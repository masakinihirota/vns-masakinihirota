import { auth } from "@/lib/auth/helper";
import * as notifDb from "@/lib/db/notifications";
import type { NewNotification } from "@/lib/db/types";


type NotificationInsert = NewNotification;

/**
 *
 * @param notificationData
 */
export async function createNotificationAction(
  notificationData: NotificationInsert
) {
  return notifDb.createNotification(notificationData);
}

/**
 *
 */
export async function getUnreadNotificationsAction() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return notifDb.getUnreadNotifications(session.user.id);
}

/**
 *
 * @param notificationId
 */
export async function markNotificationAsReadAction(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return notifDb.markNotificationAsRead(notificationId);
}
