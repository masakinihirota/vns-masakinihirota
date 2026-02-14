"use server";

import * as notifDb from "@/lib/db/notifications";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/types/types_db";

type NotificationInsert = TablesInsert<"notifications">;

export async function createNotificationAction(notificationData: NotificationInsert) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return notifDb.createNotification(supabase, notificationData);
}

export async function getUnreadNotificationsAction(userId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return notifDb.getUnreadNotifications(supabase, userId);
}

export async function markNotificationAsReadAction(notificationId: string) {
  const isDrizzle = process.env.USE_DRIZZLE === "true";
  const supabase = isDrizzle ? null : await createClient();
  return notifDb.markNotificationAsRead(supabase, notificationId);
}
