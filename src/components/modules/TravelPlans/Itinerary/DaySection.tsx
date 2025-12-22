import { ItineraryItem } from "@/types/itinerary.interface";
import { format } from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ItineraryItemCard from "./ItineraryItemCard";
import AddItemButton from "./AddItemButton";
import { TravelPlan } from "@/types/travelPlan.interface";
import { isDayPast } from "@/utils/planDateHelpers";

interface DaySectionProps {
  dayIndex: number;
  dayDate: Date;
  items: ItineraryItem[];
  plan: TravelPlan;
  planId: string;
  isEditor: boolean;
}

export default function DaySection({
  dayIndex,
  dayDate,
  items,
  plan,
  planId,
  isEditor,
}: DaySectionProps) {
  // Only show AddItemButton if editor AND day is not past
  const isDayInPast = isDayPast(plan.startDate, dayIndex);
  const canAddItem = isEditor && !isDayInPast;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h3 className="text-xl font-semibold">Day {dayIndex}</h3>
          <p className="text-sm text-muted-foreground">
            {format(dayDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        {canAddItem && <AddItemButton plan={plan} planId={planId} defaultDayIndex={dayIndex} />}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No activities planned for this day
          </p>
        ) : (
          items.map((item) => (
            <ItineraryItemCard
              key={item.id}
              item={item}
              plan={plan}
              planId={planId}
              isEditor={isEditor}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

