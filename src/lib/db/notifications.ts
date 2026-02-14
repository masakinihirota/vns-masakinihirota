import { Database } from "@/types/database.types";
import type { TablesInsert } from "@/types/types_db";
import { SupabaseClient } from "@supabase/supabase-js";
import { and, desc, eq } from "drizzle-orm";
import { db } from "./drizzle";
import { notifications } from "./schema";

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
  supabase: SupabaseClient<Database> | null,
  notificationData: NotificationInsert
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const drizzleInput = {
      userProfileId: notificationData.user_profile_id,
      title: notificationData.title,
      message: notificationData.message,
      linkUrl: notificationData.link_url,
      type: notificationData.type,
      isRead: false,
    };

    const [newNotification] = await db.insert(notifications).values(drizzleInput).returning();
    return mapNotificationToSupabase(newNotification);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("notifications")
    .insert(notificationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUnreadNotifications = async (
  supabase: SupabaseClient<Database> | null,
  userId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const result = await db.query.notifications.findMany({
      where: and(
        eq(notifications.userProfileId, userId),
        eq(notifications.isRead, false)
      ),
      orderBy: [desc(notifications.createdAt)],
    });
    return result.map(mapNotificationToSupabase);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_profile_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (
  supabase: SupabaseClient<Database> | null,
  notificationId: string
) => {
  if (process.env.USE_DRIZZLE === "true") {
    const [updated] = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .returning();
    return mapNotificationToSupabase(updated);
  }

  if (!supabase) throw new Error("Supabase client required when USE_DRIZZLE is false");

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
