import { Meetup } from "@/types/meetup.interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MapPin, Calendar, Users, Video } from "lucide-react";
import Link from "next/link";
import MeetupActions from "./MeetupActions";

interface MeetupCardProps {
  meetup: Meetup;
  currentUserId?: string;
  isEditor?: boolean;
}

const statusColors: Record<
  Meetup["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  UPCOMING: "default",
  ONGOING: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export default function MeetupCard({
  meetup,
  currentUserId,
  isEditor = false,
}: MeetupCardProps) {
  const scheduledDate = new Date(meetup.scheduledAt);
  const rsvpCount = meetup.rsvps?.length || 0;
  const acceptedCount =
    meetup.rsvps?.filter((r) => r.status === "ACCEPTED").length || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/dashboard/meetups/${meetup.id}`}
                className="text-lg font-semibold hover:underline"
              >
                {meetup.title}
              </Link>
              <Badge variant={statusColors[meetup.status] || "outline"}>
                {meetup.status}
              </Badge>
            </div>
            {meetup.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {meetup.description}
              </p>
            )}
          </div>
          {isEditor && (
            <MeetupActions meetup={meetup} planId={meetup.planId} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{meetup.location}</span>
          </div>

          {/* Scheduled Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(scheduledDate, "MMM d, yyyy 'at' h:mm a")}
            </span>
          </div>

          {/* RSVP Count */}
          {rsvpCount > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {acceptedCount} of {rsvpCount} confirmed
              </span>
            </div>
          )}

          {/* Meeting Link */}
          {meetup.videoRoomLink && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Video className="h-4 w-4 text-muted-foreground" />
              <a
                href={meetup.videoRoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
              >
                Join Google Meet
              </a>
            </div>
          )}

          {/* Plan Link */}
          {meetup.plan && (
            <div className="pt-2 border-t">
              <Link
                href={`/dashboard/travel-plans/${meetup.planId}`}
                className="text-sm text-primary hover:underline"
              >
                {meetup.plan.title}
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

