import { MediaItem } from "@/types/media.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import MediaGrid from "../MediaGrid";
import MediaTabActions from "./MediaTabActions";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface MediaTabProps {
  plan: TravelPlan;
  mediaItems: MediaItem[];
  mediaError?: string | null;
  currentUserRole?: string;
}

export default function MediaTab({
  plan,
  mediaItems,
  mediaError,
  currentUserRole,
}: MediaTabProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(currentUserRole || "");

  // Error State
  if (mediaError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {mediaError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <MediaTabActions plan={plan} isEditor={isEditor} />

      <Separator />

      {/* Media Grid */}
      <MediaGrid
        images={mediaItems}
        plan={plan}
        isEditor={isEditor}
      />
    </div>
  );
}

