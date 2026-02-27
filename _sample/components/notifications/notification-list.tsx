import { useRouter } from "next/navigation";

import { Notification } from "@/components/groups/groups.types";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { useMarkAsRead, useNotifications } from "./notifications.logic";

export const NotificationList = () => {
  const session: any = (useSession as any)();
  const currentUserId = (session?.user as any)?.id ?? null;
  const isLoggedIn = !!session?.user;
  const { notifications, isLoading, mutate } = useNotifications(currentUserId as any);
  const { markAsRead } = useMarkAsRead();
  const router = useRouter();

  const handleRead = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      await mutate(); // Optimistic update ideally
    }
    if (notification.linkUrl) {
      router.push(notification.linkUrl);
    }
  };

  if (isLoading)
    return (
      <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
    );

  if (!isLoggedIn)
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Please login to see notifications.
      </div>
    );

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No new notifications.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-md border p-4 overflow-y-auto">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "flex flex-col gap-1 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors",
              notification.isRead
                ? "bg-background"
                : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
            )}
            onClick={() => handleRead(notification)}
          >
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-semibold">{notification.title}</h4>
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
