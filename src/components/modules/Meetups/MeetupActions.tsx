"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Meetup } from "@/types/meetup.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { deleteMeetup } from "@/services/meetups/deleteMeetup";
import { updateMeetupStatus } from "@/services/meetups/updateMeetupStatus";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import MeetupFormDialog from "./MeetupFormDialog";

interface MeetupActionsProps {
  meetup: Meetup;
  planId: string;
  plan?: TravelPlan;
  onDeleted?: () => void;
}

export default function MeetupActions({
  meetup,
  planId,
  plan,
  onDeleted,
}: MeetupActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showDeleteAfterComplete, setShowDeleteAfterComplete] = useState(false);

  // Can edit and complete if status is UPCOMING, ONGOING, or PENDING
  const canEdit = meetup.status !== "COMPLETED" && meetup.status !== "CANCELLED";
  const canComplete = meetup.status === "UPCOMING" || meetup.status === "ONGOING" || meetup.status === "PENDING";
  const isCompleted = meetup.status === "COMPLETED";

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteMeetup(planId, meetup.id);
      if (result.success) {
        toast.success(result.message);
        setShowDeleteConfirm(false);
        if (onDeleted) {
          onDeleted();
        } else {
          router.refresh();
        }
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleComplete = async () => {
    startTransition(async () => {
      const result = await updateMeetupStatus(planId, meetup.id, "COMPLETED");
      if (result.success) {
        toast.success(result.message);
        setShowCompleteConfirm(false);
        router.refresh();
        // After completion, show option to delete
        setShowDeleteAfterComplete(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDeleteAfterComplete = async () => {
    startTransition(async () => {
      const result = await deleteMeetup(planId, meetup.id);
      if (result.success) {
        toast.success("Meetup completed and deleted successfully");
        setShowDeleteAfterComplete(false);
        if (onDeleted) {
          onDeleted();
        } else {
          router.refresh();
        }
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
          {canComplete && (
            <DropdownMenuItem
              onClick={() => setShowCompleteConfirm(true)}
              disabled={isPending}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Completed
            </DropdownMenuItem>
          )}
          {canEdit && (
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              disabled={isPending}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
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

      {plan && (
        <MeetupFormDialog
          plan={plan}
          meetup={meetup}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Meetup"
        description="Are you sure you want to delete this meetup? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmDialog
        open={showCompleteConfirm}
        onOpenChange={setShowCompleteConfirm}
        onConfirm={handleComplete}
        title="Mark as Completed"
        description="Mark this meetup as completed? You can delete it afterwards to keep things simple."
        confirmText="Mark Completed"
        cancelText="Cancel"
      />

      <ConfirmDialog
        open={showDeleteAfterComplete}
        onOpenChange={setShowDeleteAfterComplete}
        onConfirm={handleDeleteAfterComplete}
        title="Delete Completed Meetup"
        description="This meetup is already completed. Delete it to keep your list clean?"
        confirmText="Delete"
        cancelText="Keep It"
        variant="destructive"
      />
    </>
  );
}

