import { ItineraryDay } from "@/services/itinerary/getItinerary";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ItineraryDisplayProps {
  days: ItineraryDay[];
  planStartDate: string;
}

const ItineraryDisplay = ({ days, planStartDate }: ItineraryDisplayProps) => {
  if (!days || days.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No itinerary items yet</p>
      </div>
    );
  }

  // Helper to calculate actual date for each day
  const getDayDate = (dayIndex: number) => {
    const date = new Date(planStartDate);
    date.setDate(date.getDate() + dayIndex - 1);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Helper to format time
  const formatTime = (dateTime?: string) => {
    if (!dateTime) return null;
    return new Date(dateTime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {days.map((day) => (
        <Card key={day.day} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Day {day.day}</CardTitle>
              <Badge variant="outline" className="font-normal">
                {getDayDate(day.day)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {day.items.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No activities planned for this day
              </div>
            ) : (
              <div className="divide-y">
                {day.items
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          {index < day.items.length - 1 && (
                            <div className="w-0.5 flex-1 bg-border mt-2" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          {/* Time */}
                          {(item.startAt || item.endAt) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>
                                {formatTime(item.startAt)}
                                {item.endAt && ` - ${formatTime(item.endAt)}`}
                              </span>
                            </div>
                          )}

                          {/* Title */}
                          <h4 className="font-semibold text-lg">{item.title}</h4>

                          {/* Description */}
                          {item.description && (
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          )}

                          {/* Location */}
                          {item.location && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">{item.location.name}</p>
                                {(item.location.address ||
                                  item.location.city ||
                                  item.location.country) && (
                                  <p className="text-muted-foreground">
                                    {[
                                      item.location.address,
                                      item.location.city,
                                      item.location.country,
                                    ]
                                      .filter(Boolean)
                                      .join(", ")}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItineraryDisplay;

