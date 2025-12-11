import { Suspense } from "react";
import { getMyRequests } from "@/services/tripBookings/getMyRequests";
import MyRequestCard from "@/components/modules/Dashboard/TripBookings/MyRequestCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket } from "lucide-react";

export const revalidate = 0; // Revalidate on every request

const RequestsSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <div className="flex flex-col sm:flex-row h-32">
          <Skeleton className="w-full sm:w-48 h-full" />
          <div className="flex-1 p-4 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default async function MyRequestsPage() {
  const result = await getMyRequests();
  const bookings = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Join Requests</h1>
        <p className="text-muted-foreground mt-1">
          Manage your requests to join travel plans
        </p>
      </div>

      <Suspense fallback={<RequestsSkeleton />}>
        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Ticket className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">No Requests Found</h3>
            <p className="text-muted-foreground mt-2">
              You haven&apos;t sent any requests to join travel plans yet.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <MyRequestCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
}

