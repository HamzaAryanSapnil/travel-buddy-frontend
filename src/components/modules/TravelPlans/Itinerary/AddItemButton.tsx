"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ItineraryItemFormDialog from "./ItineraryItemFormDialog";
import { TravelPlan } from "@/types/travelPlan.interface";

interface AddItemButtonProps {
  plan: TravelPlan;
  planId: string;
  defaultDayIndex: number;
}

export default function AddItemButton({
  plan,
  defaultDayIndex,
}: AddItemButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setShowDialog(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Activity
      </Button>

      <ItineraryItemFormDialog
        plan={plan}
        mode="create"
        open={showDialog}
        onOpenChange={setShowDialog}
        defaultDayIndex={defaultDayIndex}
      />
    </>
  );
}
