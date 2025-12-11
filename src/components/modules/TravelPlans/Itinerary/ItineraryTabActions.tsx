"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TravelPlan } from "@/types/travelPlan.interface";
import ItineraryItemFormDialog from "./ItineraryItemFormDialog";

interface ItineraryTabActionsProps {
  plan: TravelPlan;
  isEditor: boolean;
}

export default function ItineraryTabActions({
  plan,
  isEditor,
}: ItineraryTabActionsProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (!isEditor) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Itinerary</h2>
        <p className="text-muted-foreground">View the trip itinerary.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Itinerary</h2>
          <p className="text-muted-foreground">
            Plan your trip day by day.
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Button>
      </div>

      <ItineraryItemFormDialog
        plan={plan}
        mode="create"
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}

