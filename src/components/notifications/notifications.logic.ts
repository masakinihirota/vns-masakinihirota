"use client";

import useSWR from "swr";
import { Notification } from "@/components/groups/groups.types";
import {
  getUnreadNotifications,
  markNotificationAsRead,
} from "@/lib/db/notifications";
import { createClient } from "@/lib/supabase/client";

const fetcher = async (key: string) => {
  const [, userId] = key.split(":");
  if (!userId) return [];
  const supabase = createClient();
  return (await getUnreadNotifications(supabase, userId)) as Notification[];
};

export const useNotifications = (userId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    userId ? `notifications:${userId}` : null,
    fetcher
  );

  return {
    notifications: data,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useMarkAsRead = () => {
  const markAsRead = async (notificationId: string) => {
    const supabase = createClient();
    return await markNotificationAsRead(supabase, notificationId);
  };
  return { markAsRead };
};
