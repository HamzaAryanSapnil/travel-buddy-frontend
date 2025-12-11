import { TripBooking } from "@/types/tripBooking.interface";
import RequestApprovalCard from "./RequestApprovalCard";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PendingRequestsListProps {
  requests: TripBooking[];
  requestsError?: string | null;
  planId: string;
}

export default function PendingRequestsList({
  requests,
  requestsError,
  planId,
}: PendingRequestsListProps) {
  // Error State
  if (requestsError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {requestsError}</p>
      </Card>
    );
  }

  // Empty State
  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <Users className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Pending Requests</h3>
        <p className="text-muted-foreground mt-2">
          There are no pending join requests for this travel plan at the moment.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Pending Requests
        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          {requests.length}
        </span>
      </h3>
      {requests.map((request) => (
        <RequestApprovalCard
          key={request.id}
          booking={request}
          planId={planId}
        />
      ))}
    </div>
  );
}

