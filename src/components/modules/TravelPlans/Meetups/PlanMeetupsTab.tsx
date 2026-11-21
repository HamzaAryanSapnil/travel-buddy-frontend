import MeetupsTabActions from "./MeetupsTabActions";
import MeetupsList from "@/components/modules/Meetups/MeetupsList";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface PlanMeetupsTabProps {
  plan: TravelPlan;
  meetups: Meetup[];
  members: TripMember[];
  meetupsError?: string | null;
  currentUserRole?: string;
  currentUserId?: string;
}

export default function PlanMeetupsTab({
  plan,
  meetups,
  meetupsError,
  currentUserRole,
  currentUserId,
}: PlanMeetupsTabProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(currentUserRole || "");

  // Error State
  if (meetupsError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {meetupsError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <MeetupsTabActions plan={plan} isEditor={isEditor} />

      <Separator />

      {/* Meetups List */}
      <MeetupsList
        meetups={meetups}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        plan={plan}
      />
    </div>
  );
}

