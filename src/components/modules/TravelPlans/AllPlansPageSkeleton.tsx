import { Skeleton } from "@/components/ui/skeleton";
import PlanCardSkeleton from "@/components/modules/Home/PlanCardSkeleton";

export default function AllPlansPageSkeleton() {
  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 sm:h-14 md:h-16 w-80 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Skeleton */}
            <Skeleton className="h-10 flex-1" />
            {/* Select Filters Skeleton */}
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Plans Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <PlanCardSkeleton key={index} />
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </main>
  );
}

