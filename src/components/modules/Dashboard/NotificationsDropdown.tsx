import { getNotifications } from "@/services/notifications/getNotifications";
import { Notification } from "@/types/notification.interface";
import { formatRelativeTime } from "@/lib/formatters";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import NotificationItemClient from "./NotificationItemClient";

interface NotificationsDropdownContentProps {
  notifications: Notification[];
}

function NotificationsDropdownContent({
  notifications,
}: NotificationsDropdownContentProps) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="space-y-1 p-1">
        {notifications.slice(0, 10).map((notification) => (
          <NotificationItemClient
            key={notification.id}
            notification={notification}
            variant="dropdown"
          />
        ))}
      </div>
      {notifications.length > 10 && (
        <div className="border-t p-2">
          <Link
            href="/dashboard/notifications"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default async function NotificationsDropdown() {
  // Fetch recent notifications (unread first, then recent)
  let notifications: Notification[] = [];
  let error: string | null = null;

  try {
    // Fetch unread notifications first
    const unreadResult = await getNotifications({ isRead: false, limit: 10 });
    if (unreadResult.success) {
      notifications = unreadResult.data || [];
    }

    // If we have less than 10 unread, fetch some read ones
    if (notifications.length < 10) {
      const readResult = await getNotifications({
        isRead: true,
        limit: 10 - notifications.length,
      });
      if (readResult.success && readResult.data) {
        notifications = [...notifications, ...readResult.data];
      }
    }
  } catch (err: any) {
    error = err.message || "Failed to load notifications";
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-destructive">{error}</div>
    );
  }

  return <NotificationsDropdownContent notifications={notifications} />;
}
