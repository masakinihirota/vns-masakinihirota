"use server";

import * as notifDb from "@/lib/db/notifications";
import type { TablesInsert } from "@/types/types_db";

type NotificationInsert = TablesInsert<"notifications">;

export async function createNotificationAction(notificationData: NotificationInsert) {
  return notifDb.createNotification(notificationData);
}

export async function getUnreadNotificationsAction(userId: string) {
  return notifDb.getUnreadNotifications(userId);
}

export async function markNotificationAsReadAction(notificationId: string) {
  return notifDb.markNotificationAsRead(notificationId);
}
