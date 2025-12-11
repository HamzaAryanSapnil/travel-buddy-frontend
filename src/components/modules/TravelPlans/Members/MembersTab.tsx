import { Separator } from "@/components/ui/separator";
import { TripMember } from "@/types/tripMembers.interface";
import { TripBooking } from "@/types/tripBooking.interface";
import MembersList from "./MembersList";
import MembersTabActions from "./MembersTabActions";
import PendingRequestsList from "../ManageRequests/PendingRequestsList";

interface MembersTabProps {
  planId: string;
  currentUserId?: string;
  currentUserRole?: string;
  members: TripMember[];
  pendingRequests: TripBooking[];
  membersError?: string | null;
  requestsError?: string | null;
}

export default function MembersTab({
  planId,
  currentUserId,
  currentUserRole,
  members,
  pendingRequests,
  membersError,
  requestsError,
}: MembersTabProps) {
  const isManager = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <MembersTabActions planId={planId} isManager={isManager} />

      <Separator />

      {/* Pending Requests Section - Only visible to managers */}
      {isManager && (
        <div className="space-y-4">
          <PendingRequestsList
            requests={pendingRequests}
            requestsError={requestsError}
            planId={planId}
          />
          <Separator />
        </div>
      )}

      {/* Members List Section */}
      <MembersList
        members={members}
        membersError={membersError}
        currentUserId={currentUserId}
        currentUserRole={currentUserRole}
        planId={planId}
      />
    </div>
  );
}
