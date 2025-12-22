import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactPageSkeleton() {
  return (
    <main className="min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <Skeleton className="h-12 sm:h-14 md:h-16 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form Card Skeleton - 2/3 width */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-7 w-48" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-5 w-64" />
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Form Fields Skeleton */}
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Card Skeleton - 1/3 width */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton className="h-7 w-48" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Section Skeleton */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-5 w-48" />
                  </div>

                  {/* Response Time Section Skeleton */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-5 w-56" />
                  </div>

                  {/* Office Hours Section Skeleton */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

