import { ItineraryDay, ItineraryItem } from "@/types/itinerary.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import DayByDayView from "./DayByDayView";
import ItineraryTabActions from "./ItineraryTabActions";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface ItineraryTabProps {
  plan: TravelPlan;
  itineraryDays: ItineraryDay[];
  itineraryTotalDays: number;
  itineraryError?: string | null;
  currentUserRole?: string;
}

export default function ItineraryTab({
  plan,
  itineraryDays,
  itineraryTotalDays,
  itineraryError,
  currentUserRole,
}: ItineraryTabProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(currentUserRole || "");

  // Error State
  if (itineraryError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {itineraryError}</p>
      </Card>
    );
  }

  


  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <ItineraryTabActions plan={plan} isEditor={isEditor} />

      <Separator />

      {/* Day-by-Day View */}
      <DayByDayView
        plan={plan}
        itineraryDays={itineraryDays}
        itineraryTotalDays={itineraryTotalDays}
        isEditor={isEditor}
      />
    </div>
  );
}
