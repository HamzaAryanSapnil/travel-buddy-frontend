import { ItineraryItem } from "@/types/itinerary.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import ItineraryItemActions from "./ItineraryItemActions";
import { TravelPlan } from "@/types/travelPlan.interface";

interface ItineraryItemCardProps {
  item: ItineraryItem;
  plan: TravelPlan;
  planId: string;
  isEditor: boolean;
}

export default function ItineraryItemCard({
  item,
  plan,
  planId,
  isEditor,
}: ItineraryItemCardProps) {
  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    return format(new Date(dateString), "h:mm a");
  };

  const startTime = formatTime(item.startAt);
  const endTime = formatTime(item.endAt);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Time Range */}
            {(startTime || endTime) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {startTime && endTime
                    ? `${startTime} - ${endTime}`
                    : startTime || endTime}
                </span>
              </div>
            )}

            {/* Title */}
            <h4 className="text-base font-semibold">{item.title}</h4>

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {item.description}
              </p>
            )}

            {/* Location */}
            {item.locationId && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location ID: {item.locationId}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {isEditor && (
            <ItineraryItemActions item={item} plan={plan} planId={planId} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

