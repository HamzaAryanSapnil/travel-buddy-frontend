import { TripMember } from "@/types/tripMembers.interface";
import MemberCard from "./MemberCard";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface MembersListProps {
  members: TripMember[];
  membersError?: string | null;
  currentUserId?: string;
  currentUserRole?: string;
  planId: string;
}

export default function MembersList({
  members,
  membersError,
  currentUserId,
  currentUserRole,
  planId,
}: MembersListProps) {
  const isManager = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  // Error State
  if (membersError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {membersError}</p>
      </Card>
    );
  }

  // Empty State
  if (members.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <Users className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Members Found</h3>
        <p className="text-muted-foreground mt-2">
          This trip has no members yet.
        </p>
      </Card>
    );
  }

  // Sort members: Owner first, then Admins, then others
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { OWNER: 0, ADMIN: 1, EDITOR: 2, VIEWER: 3 };
    return roleOrder[a.role] - roleOrder[b.role];
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Trip Members
        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
          {members.length}
        </span>
      </h3>
      {sortedMembers.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          currentUserId={currentUserId}
          isManager={isManager}
          planId={planId}
        />
      ))}
    </div>
  );
}

