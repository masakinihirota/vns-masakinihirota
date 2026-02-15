"use client";

import useSWR from "swr";
import {
  getUnreadNotificationsAction,
  markNotificationAsReadAction,
} from "@/app/actions/notifications";
import { Notification } from "@/components/groups/groups.types";

const fetcher = async () => {
  return (await getUnreadNotificationsAction()) as Notification[];
};

export const useNotifications = (isLoggedIn: boolean) => {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    isLoggedIn ? "notifications" : null,
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
    return await markNotificationAsReadAction(notificationId);
  };
  return { markAsRead };
};
