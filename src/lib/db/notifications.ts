import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { isDrizzle } from "./adapter";
import {
  createNotificationDrizzle,
  getUnreadNotificationsDrizzle,
  markNotificationAsReadDrizzle,
} from "./drizzle";

export type NotificationType = "system" | "invite" | "transaction" | "event";

export const createNotification = async (
  supabase: SupabaseClient<Database>,
  notificationData: {
    user_profile_id: string;
    title: string;
    message: string;
    link_url?: string;
    type: NotificationType;
  }
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return createNotificationDrizzle(notificationData);
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert(notificationData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUnreadNotifications = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return getUnreadNotificationsDrizzle(userId);
  }

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
  supabase: SupabaseClient<Database>,
  notificationId: string
) => {
  // Drizzleアダプターが有効な場合はDrizzle実装に委譲
  if (isDrizzle()) {
    return markNotificationAsReadDrizzle(notificationId);
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
