import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

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
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
