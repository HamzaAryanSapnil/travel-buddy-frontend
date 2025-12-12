

import PlanCard from "@/components/modules/TravelPlans/PlanCard";
import { Button } from "@/components/ui/button";
import { getPublicTravelPlans } from "@/services/travelPlans/getPublicTravelPlans";
import Link from "next/link";

export default async function FeaturedPlansSection() {
  const featured = await getPublicTravelPlans({
    isFeatured: true,
    limit: 6,
    sortBy: "startDate",
    sortOrder: "asc",
  });

  const plans = featured.success ? featured.data || [] : [];
  const hasPlans = plans.length > 0;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Adventures</h2>
            <p className="text-muted-foreground">
              Hand-picked travel plans from our community
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/plans?isFeatured=true">View All Plans</Link>
          </Button>
        </div>

        {!hasPlans ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            No featured plans yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


