"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";

interface NotificationsBellProps {
  unreadCount: number;
}

const NotificationsBell = ({ unreadCount }: NotificationsBellProps) => {
  const hasUnread = unreadCount > 0;
  const displayCount = unreadCount > 99 ? "99+" : unreadCount;

  return (
    <Link href="/dashboard/notifications">
      <Button variant="outline" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {displayCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default NotificationsBell;

