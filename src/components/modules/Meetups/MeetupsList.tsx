import { Meetup } from "@/types/meetup.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import MeetupCard from "./MeetupCard";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface MeetupsListProps {
  meetups: Meetup[];
  currentUserId?: string;
  currentUserRole?: string;
  plan?: TravelPlan;
}

export default function MeetupsList({
  meetups,
  currentUserId,
  currentUserRole,
  plan,
}: MeetupsListProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(
    currentUserRole || ""
  );

  if (meetups.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Meetups Yet</h3>
        <p className="text-muted-foreground mt-2">
          {isEditor
            ? "Start scheduling meetups by creating your first one."
            : "No meetups have been scheduled yet."}
        </p>
      </Card>
    );
  }

  // Sort meetups by scheduled date (upcoming first)
  const sortedMeetups = [...meetups].sort((a, b) => {
    const dateA = new Date(a.scheduledAt).getTime();
    const dateB = new Date(b.scheduledAt).getTime();
    return dateA - dateB;
  });

  return (
    <div className="space-y-4">
      {sortedMeetups.map((meetup) => (
        <MeetupCard
          key={meetup.id}
          meetup={meetup}
          currentUserId={currentUserId}
          isEditor={isEditor}
          plan={plan}
        />
      ))}
    </div>
  );
}

