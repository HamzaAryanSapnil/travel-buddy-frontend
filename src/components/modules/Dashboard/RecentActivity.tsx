import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentActivity as RecentActivityType } from "@/types/dashboard.interface";
import { getActivityIcon } from "@/lib/activity-icon-mapper";
import { formatRelativeTime } from "@/lib/formatters";
import Link from "next/link";

interface RecentActivityProps {
  activities: RecentActivityType[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const content = (
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );

            if (activity.link) {
              return (
                <Link key={index} href={activity.link}>
                  {content}
                </Link>
              );
            }

            return <div key={index}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

