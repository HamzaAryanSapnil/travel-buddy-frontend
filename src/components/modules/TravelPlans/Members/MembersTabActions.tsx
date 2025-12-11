"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import InviteMemberDialog from "./InviteMemberDialog";

interface MembersTabActionsProps {
  planId: string;
  isManager: boolean;
}

export default function MembersTabActions({
  planId,
  isManager,
}: MembersTabActionsProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  if (!isManager) {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            View members of this travel plan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            Manage who can view and edit this plan.
          </p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <InviteMemberDialog
        planId={planId}
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
    </>
  );
}

