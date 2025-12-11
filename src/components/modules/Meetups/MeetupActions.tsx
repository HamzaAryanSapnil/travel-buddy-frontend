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
import { Meetup } from "@/types/meetup.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { deleteMeetup } from "@/services/meetups/deleteMeetup";
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
    </>
  );
}

