import { TravelPlan } from "@/types/travelPlan.interface";
import { MediaItem } from "@/types/media.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MediaGrid from "@/components/modules/TravelPlans/MediaGrid";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface GalleryPanelProps {
  plan: TravelPlan;
  mediaItems: MediaItem[];
  mediaError?: string | null;
}

export default function GalleryPanel({
  plan,
  mediaItems,
  mediaError,
}: GalleryPanelProps) {
  if (mediaError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {mediaError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{plan.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <div>
            Destination: <span className="font-medium text-foreground">{plan.destination}</span>
          </div>
          <div>
            Dates:{" "}
            <span className="font-medium text-foreground">
              {format(new Date(plan.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(plan.endDate), "MMM d, yyyy")}
            </span>
          </div>
          <div>
            Visibility: <span className="font-medium text-foreground">{plan.visibility}</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <MediaGrid images={mediaItems} plan={plan} isEditor={false} />
    </div>
  );
}

