import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPageSkeleton() {
  return (
    <main className="min-h-screen">
      {/* Mission Section Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center space-y-6">
            {/* Title Skeleton */}
            <Skeleton className="h-12 sm:h-14 md:h-16 w-64 mx-auto" />
            {/* Paragraph Skeleton - 3 lines */}
            <div className="space-y-2 max-w-3xl mx-auto">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section Skeleton */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center space-y-6">
            {/* Title Skeleton */}
            <Skeleton className="h-10 sm:h-12 md:h-14 w-48 mx-auto" />
            {/* Paragraph Skeleton - 4 lines */}
            <div className="space-y-2 max-w-3xl mx-auto">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-4/6 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section Skeleton */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-12 md:mb-16">
              <Skeleton className="h-10 sm:h-12 md:h-14 w-80 mx-auto" />
            </div>

            {/* Values Grid Skeleton - 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    {/* Icon Skeleton */}
                    <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                    {/* Title Skeleton */}
                    <Skeleton className="h-7 w-32" />
                  </CardHeader>
                  <CardContent>
                    {/* Description Skeleton - 2 lines */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

