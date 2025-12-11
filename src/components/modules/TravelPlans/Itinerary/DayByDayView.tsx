import { ItineraryDay, ItineraryItem } from "@/types/itinerary.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import DaySection from "./DaySection";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface DayByDayViewProps {
  plan: TravelPlan;
  itineraryDays: ItineraryDay[];
  itineraryTotalDays: number;
  isEditor: boolean;
}

export default function DayByDayView({
  plan,
  itineraryDays,
  itineraryTotalDays,
  isEditor,
}: DayByDayViewProps) {
  // Calculate total days
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  

  // Group items by dayIndex
  const itemsByDayMap = new Map<number, (typeof itineraryDays)[0]["items"]>();
  itineraryDays.forEach((day) => {
    // Sort items by order
    const sortedItems = [...day.items].sort((a, b) => a.order - b.order);
    itemsByDayMap.set(day.day, sortedItems);
  });

  // Check if we have any items
  const hasItems = itineraryDays.some((day) => day.items.length > 0);

  // Empty state
  if (!hasItems) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <Calendar className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Itinerary Items Yet</h3>
        <p className="text-muted-foreground mt-2">
          {isEditor
            ? "Start planning your trip by adding activities."
            : "The itinerary hasn't been created yet."}
        </p>
      </Card>
    );
  }

  // Render day sections
  return (
    <div className="space-y-6">
      {Array.from({ length: totalDays }, (_, index) => {
        const dayIndex = index + 1;
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);
        const items = itemsByDayMap.get(dayIndex) || [];

        return (
          <DaySection
            key={dayIndex}
            dayIndex={dayIndex}
            dayDate={dayDate}
            items={items}
            plan={plan}
            planId={plan.id}
            isEditor={isEditor}
          />
        );
      })}
    </div>
  );
}
