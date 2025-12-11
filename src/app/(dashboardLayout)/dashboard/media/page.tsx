import { getTravelPlans } from "@/services/travelPlans/getTravelPlans";
import { getMedia } from "@/services/media/getMedia";
import GalleryPanel from "@/components/modules/Collaboration/GalleryPanel";
import GalleryPlanSelect from "@/components/modules/Collaboration/GalleryPlanSelect";
import { Card } from "@/components/ui/card";

interface MediaGalleryPageProps {
  searchParams: Promise<{
    planId?: string;
  }>;
}

export default async function MediaGalleryPage({
  searchParams,
}: MediaGalleryPageProps) {
  const params = await searchParams;
  const planIdParam = params.planId;

  // Fetch user's travel plans (limited)
  const plansData = await getTravelPlans({ page: 1, limit: 20 });
  const plans = plansData?.data || [];

  if (!plans.length) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 text-center text-muted-foreground">
          No travel plans found. Create a plan to see your gallery.
        </Card>
      </div>
    );
  }

  const selectedPlan =
    plans.find((p) => p.id === planIdParam) || plans[0];

  const mediaResult = await getMedia(selectedPlan.id, { type: "photo" });
  const mediaItems = mediaResult?.data || [];
  const mediaError = mediaResult?.error || null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <p className="text-muted-foreground">
            View read-only media from your travel plans.
          </p>
        </div>

        <GalleryPlanSelect
          plans={plans.map((p) => ({ id: p.id, title: p.title }))}
          selectedPlanId={selectedPlan.id}
        />
      </div>

      <GalleryPanel
        plan={selectedPlan}
        mediaItems={mediaItems}
        mediaError={mediaError}
      />
    </div>
  );
}

