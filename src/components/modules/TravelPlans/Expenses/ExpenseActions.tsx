"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Expense } from "@/types/expense.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import { deleteExpense } from "@/services/expenses/deleteExpense";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ExpenseFormDialog from "./ExpenseFormDialog";

interface ExpenseActionsProps {
  expense: Expense;
  planId: string;
  members: TripMember[];
  plan: TravelPlan;
}

export default function ExpenseActions({
  expense,
  planId,
  members,
  plan,
}: ExpenseActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteExpense(planId, expense.id);
      if (result.success) {
        toast.success(result.message);
        setShowDeleteConfirm(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isPending}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setShowEditDialog(true)}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ExpenseFormDialog
        plan={plan}
        members={members}
        expense={expense}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Expense"
        description="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}

