import { Meetup } from "@/types/meetup.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MapPin, Calendar, Users, User, Video, ExternalLink } from "lucide-react";
import Link from "next/link";
import RSVPButton from "./RSVPButton";
import MeetupActions from "./MeetupActions";

interface MeetupDetailProps {
  meetup: Meetup;
  currentUserId?: string;
  currentUserRole?: string;
  plan?: TravelPlan;
}

const statusColors: Record<
  Meetup["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  UPCOMING: "default",
  ONGOING: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  PENDING: "secondary",
};

const rsvpStatusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACCEPTED: "default",
  DECLINED: "destructive",
  PENDING: "outline",
  MAYBE: "secondary",
};

export default function MeetupDetail({
  meetup,
  currentUserId,
  currentUserRole,
  plan,
}: MeetupDetailProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(
    currentUserRole || ""
  );

  const scheduledDate = new Date(meetup.scheduledAt);
  const endDate = meetup.endAt ? new Date(meetup.endAt) : null;

  const rsvps = meetup.rsvps || [];
  const acceptedRSVPs = rsvps.filter((r) => r.status === "ACCEPTED");
  const declinedRSVPs = rsvps.filter((r) => r.status === "DECLINED");
  const maybeRSVPs = rsvps.filter((r) => r.status === "MAYBE");
  const pendingRSVPs = rsvps.filter((r) => r.status === "PENDING");

  const currentUserRSVP = currentUserId
    ? rsvps.find((r) => r.userId === currentUserId)
    : undefined;

  return (
    <div className="space-y-6">
      {/* Main Meetup Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{meetup.title}</CardTitle>
                <Badge variant={statusColors[meetup.status] || "outline"}>
                  {meetup.status}
                </Badge>
              </div>
              {meetup.description && (
                <p className="text-muted-foreground mt-2">{meetup.description}</p>
              )}
            </div>
            {isEditor && plan && (
              <MeetupActions meetup={meetup} planId={meetup.planId} plan={plan} />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-muted-foreground">{meetup.location}</p>
            </div>
          </div>

          {/* Meeting Link */}
          {meetup.videoRoomLink && (
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Google Meet</p>
                <a
                  href={meetup.videoRoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Join Meeting
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* Scheduled Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Scheduled</p>
              <p className="text-muted-foreground">
                {format(scheduledDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
              </p>
              {endDate && (
                <p className="text-muted-foreground text-sm mt-1">
                  Ends: {format(endDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </div>

          {/* Created By */}
          {meetup.createdByUser && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Created By</p>
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={meetup?.createdByUser?.profileImage || undefined}
                      alt={meetup?.createdByUser?.fullName || meetup?.createdByUser?.email || "User"}
                    />
                    <AvatarFallback className="text-xs">
                      {(meetup?.createdByUser?.fullName || meetup?.createdByUser?.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {meetup?.createdByUser?.fullName || meetup?.createdByUser?.email || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Plan Link */}
          {plan && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-1">Travel Plan</p>
              <Link
                href={`/dashboard/travel-plans/${meetup.planId}`}
                className="text-primary hover:underline"
              >
                {plan.title}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RSVP Section */}
      {currentUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Your RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <RSVPButton
              meetupId={meetup.id}
              planId={meetup.planId}
              currentRSVP={currentUserRSVP}
            />
          </CardContent>
        </Card>
      )}

      {/* RSVP List */}
      {rsvps.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                RSVPs ({rsvps.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Accepted */}
              {acceptedRSVPs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Going ({acceptedRSVPs.length})
                  </p>
                  <div className="space-y-2">
                    {acceptedRSVPs.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={rsvp.user?.profileImage || undefined}
                            alt={rsvp.user?.fullName || rsvp.user?.email || "User"}
                          />
                          <AvatarFallback>
                            {(rsvp.user?.fullName || rsvp.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {rsvp.user?.fullName || rsvp.user?.email || "Unknown"}
                          </p>
                        </div>
                        <Badge variant={rsvpStatusColors[rsvp.status] || "outline"}>
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maybe */}
              {maybeRSVPs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Maybe ({maybeRSVPs.length})
                  </p>
                  <div className="space-y-2">
                    {maybeRSVPs.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={rsvp.user?.profileImage || undefined}
                            alt={rsvp.user?.fullName || rsvp.user?.email || "User"}
                          />
                          <AvatarFallback>
                            {(rsvp.user?.fullName || rsvp.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {rsvp.user?.fullName || rsvp.user?.email || "Unknown"}
                          </p>
                        </div>
                        <Badge variant={rsvpStatusColors[rsvp.status] || "outline"}>
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending */}
              {pendingRSVPs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Pending ({pendingRSVPs.length})
                  </p>
                  <div className="space-y-2">
                    {pendingRSVPs.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={rsvp.user?.profileImage || undefined}
                            alt={rsvp.user?.fullName || rsvp.user?.email || "User"}
                          />
                          <AvatarFallback>
                            {(rsvp.user?.fullName || rsvp.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {rsvp.user?.fullName || rsvp.user?.email || "Unknown"}
                          </p>
                        </div>
                        <Badge variant={rsvpStatusColors[rsvp.status] || "outline"}>
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Declined */}
              {declinedRSVPs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Not Going ({declinedRSVPs.length})
                  </p>
                  <div className="space-y-2">
                    {declinedRSVPs.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={rsvp.user?.profileImage || undefined}
                            alt={rsvp.user?.fullName || rsvp.user?.email || "User"}
                          />
                          <AvatarFallback>
                            {(rsvp.user?.fullName || rsvp.user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {rsvp.user?.fullName || rsvp.user?.email || "Unknown"}
                          </p>
                        </div>
                        <Badge variant={rsvpStatusColors[rsvp.status] || "outline"}>
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

