"use client";

import { ROUTES } from "@/constants/routes";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NotificationItemClient from "./NotificationItemClient";

interface NotificationsDropdownProps {
  notifications?: Notification[];
}

export default function NotificationsDropdown({
  notifications = [],
}: NotificationsDropdownProps) {
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
            href={ROUTES.DASHBOARD_NOTIFICATIONS}
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
