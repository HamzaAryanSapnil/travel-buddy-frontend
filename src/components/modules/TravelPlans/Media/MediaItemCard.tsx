import { Card, CardContent } from "@/components/ui/card";
import MediaImage from "../MediaImage";
import { MediaItem } from "@/types/media.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import MediaItemActions from "./MediaItemActions";
import { format } from "date-fns";

interface MediaItemCardProps {
  item: MediaItem;
  plan: TravelPlan;
  isEditor: boolean;
}

export default function MediaItemCard({
  item,
  plan,
  isEditor,
}: MediaItemCardProps) {
  return (
    <Card className="overflow-hidden group relative">
      <CardContent className="relative aspect-square p-0">
        <MediaImage src={item?.url || ""} alt="Trip photo" />
        {isEditor && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <MediaItemActions item={item} planId={plan?.id || ""} />
          </div>
        )}
      </CardContent>
      {item?.createdAt && (
        <div className="p-2 text-xs text-muted-foreground">
          {format(new Date(item.createdAt), "MMM d, yyyy")}
        </div>
      )}
    </Card>
  );
}

