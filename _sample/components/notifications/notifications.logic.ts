"use client";

import useSWR from "swr";

import {
  getUnreadNotificationsAction,
  markNotificationAsReadAction,
} from "@/app/actions/notifications";

const fetcher = async () => {
  return (await getUnreadNotificationsAction()) as any[];
};

export const useNotifications = (isLoggedIn: boolean) => {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
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
