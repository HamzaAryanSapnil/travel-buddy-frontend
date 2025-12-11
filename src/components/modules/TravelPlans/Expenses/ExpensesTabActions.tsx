"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import ExpenseFormDialog from "./ExpenseFormDialog";

interface ExpensesTabActionsProps {
  plan: TravelPlan;
  members: TripMember[];
  isEditor: boolean;
}

export default function ExpensesTabActions({
  plan,
  members,
  isEditor,
}: ExpensesTabActionsProps) {
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  if (!isEditor) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Expenses</h2>
        <p className="text-muted-foreground">Track and manage trip expenses.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Expenses</h2>
          <p className="text-muted-foreground">
            Track expenses and split costs with your travel companions.
          </p>
        </div>
        <Button onClick={() => setShowExpenseDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <ExpenseFormDialog
        plan={plan}
        members={members}
        open={showExpenseDialog}
        onOpenChange={setShowExpenseDialog}
      />
    </>
  );
}

