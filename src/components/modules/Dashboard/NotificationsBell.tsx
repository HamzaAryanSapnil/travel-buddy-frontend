"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import Link from "next/link";

import { Notification } from "@/types/notification.interface";

interface NotificationsBellProps {
  unreadCount: number;
  notifications?: Notification[];
}

const NotificationsBell = ({ unreadCount, notifications }: NotificationsBellProps) => {
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {displayCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <Link
              href="/dashboard/notifications"
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>
        </div>
        <NotificationsDropdown notifications={notifications} />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;

