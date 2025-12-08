import { Card, CardContent } from "@/components/ui/card";
import MediaImage from "./MediaImage";
import { MediaItem } from "@/types/media.interface";

interface MediaGridProps {
  images: MediaItem[];
}

const MediaGrid = ({ images }: MediaGridProps) => {
  if (!images?.length) return null;

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

