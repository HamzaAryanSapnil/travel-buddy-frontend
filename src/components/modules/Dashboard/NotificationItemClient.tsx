"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { markAsRead } from "@/services/notifications/markAsRead";
import { Notification } from "@/types/notification.interface";
import { formatRelativeTime } from "@/lib/formatters";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationItemClientProps {
  notification: Notification;
  variant?: "dropdown" | "page";
}

function getNotificationLink(notification: Notification): string {
  const { type, data } = notification;

  // Plan-related notifications
  if (
    type === "PLAN_UPDATED" ||
    type === "MEMBER_JOINED" ||
    type === "MEMBER_LEFT" ||
    type.startsWith("ITINERARY_")
  ) {
    if (data?.planId) {
      return `/dashboard/travel-plans/${data.planId}`;
    }
  }

  // Message notifications
  if (type === "NEW_MESSAGE") {
    if (data?.threadId) {
      return `/dashboard/chat/${data.threadId}`;
    }
  }

  // Invitation notifications
  if (type === "INVITATION_RECEIVED" || type === "INVITATION_ACCEPTED") {
    return `/dashboard/my-requests`;
  }

  // Meetup notifications
  if (type.startsWith("MEETUP_")) {
    if (data?.meetupId) {
      return `/dashboard/meetups/${data.meetupId}`;
    }
    return `/dashboard/meetups`;
  }

  // Subscription/Payment notifications
  if (type.startsWith("SUBSCRIPTION_") || type.startsWith("PAYMENT_")) {
    return `/dashboard/subscriptions`;
  }

  // Default
  return `/dashboard/notifications`;
}

export default function NotificationItemClient({
  notification,
  variant = "page",
}: NotificationItemClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark as read if unread
    if (!notification.isRead) {
      startTransition(async () => {
        const formData = new FormData();
        const result = await markAsRead(notification.id, null, formData);
        if (result.success) {
          router.refresh();
        } else {
          toast.error(result.message);
        }
      });
    }

    // Navigate to link
    const link = getNotificationLink(notification);
    router.push(link);
  };

  const link = getNotificationLink(notification);
  const isUnread = !notification.isRead;

  const content = (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
        isUnread
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:bg-muted/50"
      }`}
      onClick={handleClick}
    >
      <div className="p-2 rounded-lg bg-muted shrink-0">
        <Bell className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{notification.title}</p>
          {isUnread && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        {notification.message && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>
      {variant === "page" && (
        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
      )}
    </div>
  );

  if (variant === "dropdown") {
    return content;
  }

  return <Link href={link}>{content}</Link>;
}
