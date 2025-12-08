import { getMedia } from "@/services/media/getMedia";
import MediaGrid from "./MediaGrid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

interface MediaGalleryPreviewProps {
  planId: string;
  isAuthenticated: boolean;
}

export default async function MediaGalleryPreview({
  planId,
  isAuthenticated,
}: MediaGalleryPreviewProps) {
  const { data: images, error } = await getMedia(planId, {
    type: "photo",
    limit: 9,
  });

  const hasImages = images && images.length > 0;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Trip Photos</h2>
        <Button asChild variant="outline" size="sm">
          <Link
            href={
              isAuthenticated
                ? `/dashboard/travel-plans/${planId}`
                : `/login?redirect=/dashboard/travel-plans/${planId}`
            }
          >
            View All Photos
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="p-6 text-center text-muted-foreground">
          <p>{error}</p>
        </Card>
      )}

      {!error && hasImages && <MediaGrid images={images} />}

      {!error && !hasImages && (
        <Card className="p-6 text-center text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No photos available for this plan</p>
        </Card>
      )}
    </section>
  );
}

