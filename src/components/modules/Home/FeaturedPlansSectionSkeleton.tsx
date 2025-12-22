import { Skeleton } from "@/components/ui/skeleton";
import PlanCardSkeleton from "./PlanCardSkeleton";

export default function FeaturedPlansSectionSkeleton() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="space-y-2">
            {/* Title Skeleton */}
            <Skeleton className="h-9 w-64" />
            {/* Description Skeleton */}
            <Skeleton className="h-5 w-80" />
          </div>
          {/* Button Skeleton - Right aligned on desktop */}
          <Skeleton className="h-10 w-32 sm:self-end" />
        </div>

        {/* Grid of PlanCardSkeleton - 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <PlanCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

