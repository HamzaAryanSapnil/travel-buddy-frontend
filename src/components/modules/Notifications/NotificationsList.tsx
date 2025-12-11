import { Notification } from "@/types/notification.interface";
import { Card } from "@/components/ui/card";
import NotificationItemClient from "@/components/modules/Dashboard/NotificationItemClient";

interface NotificationsListProps {
  notifications: Notification[];
  error?: string | null;
}

export default function NotificationsList({
  notifications,
  error,
}: NotificationsListProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading notifications: {error}
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No notifications found.
      </Card>
    );
  }

  return (
    <Card className="p-2 sm:p-4">
      <div className="space-y-1">
        {notifications.map((notification) => (
          <NotificationItemClient
            key={notification.id}
            notification={notification}
            variant="page"
          />
        ))}
      </div>
    </Card>
  );
}

