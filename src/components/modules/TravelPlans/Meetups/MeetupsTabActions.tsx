"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TravelPlan } from "@/types/travelPlan.interface";
import MeetupFormDialog from "@/components/modules/Meetups/MeetupFormDialog";

interface MeetupsTabActionsProps {
  plan: TravelPlan;
  isEditor: boolean;
}

export default function MeetupsTabActions({
  plan,
  isEditor,
}: MeetupsTabActionsProps) {
  const [showMeetupDialog, setShowMeetupDialog] = useState(false);

  if (!isEditor) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Meetups</h2>
        <p className="text-muted-foreground">Schedule and manage meetups with your travel companions.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Meetups</h2>
          <p className="text-muted-foreground">
            Schedule meetups and coordinate with your travel companions.
          </p>
        </div>
        <Button onClick={() => setShowMeetupDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Meetup
        </Button>
      </div>

      <MeetupFormDialog
        plan={plan}
        open={showMeetupDialog}
        onOpenChange={setShowMeetupDialog}
      />
    </>
  );
}

