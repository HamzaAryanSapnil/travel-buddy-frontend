import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Skeleton - Full section cover */}
      <Skeleton className="absolute inset-0 z-0 w-full h-full" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          {/* Headline Skeleton - Large heading (single line) */}
          <div className="flex justify-center">
            <Skeleton className="h-12 sm:h-14 md:h-16 lg:h-20 w-full max-w-4xl" />
          </div>

          {/* Subheadline Skeleton - 2-3 lines */}
          <div className="space-y-2 container mx-auto max-w-3xl">
            <Skeleton className="h-6 sm:h-7 md:h-8 w-full" />
            <Skeleton className="h-6 sm:h-7 md:h-8 w-5/6 mx-auto" />
            <Skeleton className="h-6 sm:h-7 md:h-8 w-4/6 mx-auto" />
          </div>

          {/* CTA Buttons Skeleton - Responsive layout */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Skeleton className="h-12 w-full sm:w-auto sm:px-24" />
            <Skeleton className="h-12 w-full sm:w-auto sm:px-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
