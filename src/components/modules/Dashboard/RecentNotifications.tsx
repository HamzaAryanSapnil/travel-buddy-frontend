import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/notification.interface";
import { formatRelativeTime } from "@/lib/formatters";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";

interface RecentNotificationsProps {
  notifications: Notification[];
}

const RecentNotifications = ({ notifications }: RecentNotificationsProps) => {
  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent notifications
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Notifications</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/notifications">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => {
            const link = notification.data?.planId
              ? `/dashboard/travel-plans/${notification.data.planId}`
              : notification.data?.threadId
                ? `/dashboard/chat/${notification.data.threadId}`
                : "/dashboard/notifications";

            const content = (
              <div
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  !notification.isRead
                    ? "bg-primary/5 border-l-2 border-l-primary"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="p-2 rounded-lg bg-muted">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    {!notification.isRead && (
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
              </div>
            );

            return (
              <Link key={notification.id} href={link}>
                {content}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentNotifications;

