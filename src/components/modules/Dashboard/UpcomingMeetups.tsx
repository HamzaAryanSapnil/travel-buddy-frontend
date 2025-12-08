import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpcomingMeetup } from "@/types/dashboard.interface";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface UpcomingMeetupsProps {
  meetups: UpcomingMeetup[];
}

const rsvpStatusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACCEPTED: "default",
  PENDING: "secondary",
  DECLINED: "destructive",
};

const UpcomingMeetups = ({ meetups }: UpcomingMeetupsProps) => {
  if (!meetups || meetups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No upcoming meetups
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Meetups</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/meetups">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetups.slice(0, 5).map((meetup) => (
            <Link
              key={meetup.id}
              href={`/dashboard/meetups/${meetup.id}`}
              className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-2">{meetup.planTitle}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{meetup.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(meetup.scheduledAt), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant={rsvpStatusColors[meetup.rsvpStatus] || "secondary"}>
                  {meetup.rsvpStatus}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetups;

