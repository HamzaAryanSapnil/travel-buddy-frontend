import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanCardSkeleton() {
  return (
    <Card className="group overflow-hidden flex flex-col h-full">
      {/* Cover Image Skeleton */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Card Content */}
      <CardHeader className="flex-1">
        {/* Title Skeleton - 2 lines */}
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-7 w-1/2 mb-2" />
        
        {/* Description Skeleton - 2 lines */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Destination Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Date Range Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Budget Range Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 flex-shrink-0" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>

      {/* Card Footer with Button Skeleton */}
      <CardFooter className="flex flex-col gap-2 pt-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

