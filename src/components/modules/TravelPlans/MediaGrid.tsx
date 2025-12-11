import { MediaItem } from "@/types/media.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import MediaItemCard from "./Media/MediaItemCard";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import MediaImage from "./MediaImage";

interface MediaGridProps {
  images: MediaItem[];
  plan?: TravelPlan;
  isEditor?: boolean;
}

const MediaGrid = ({ images, plan, isEditor = false }: MediaGridProps) => {
  if (!images?.length) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Media Yet</h3>
        <p className="text-muted-foreground mt-2">
          {isEditor
            ? "Start sharing your trip by uploading photos."
            : "No photos or videos have been uploaded yet."}
        </p>
      </Card>
    );
  }

  // If plan is provided, use MediaItemCard (dashboard view with actions)
  if (plan) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <MediaItemCard
            key={image.id}
            item={image}
            plan={plan}
            isEditor={isEditor}
          />
        ))}
      </div>
    );
  }

  // Otherwise, use simple grid (public preview view)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden">
          <CardContent className="relative aspect-square p-0">
            <MediaImage src={image.url} alt="Trip photo" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MediaGrid;

