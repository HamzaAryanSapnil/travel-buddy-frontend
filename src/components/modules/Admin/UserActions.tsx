"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Ban, CheckCircle, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserStatus } from "@/services/admin/updateUserStatus";
import { toast } from "sonner";
import ConfirmActionDialog from "./ConfirmActionDialog";

interface UserActionsProps {
  userId: string;
  currentStatus: "ACTIVE" | "SUSPENDED" | "DELETED";
}

export default function UserActions({
  userId,
  currentStatus,
}: UserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "suspend" | "activate" | "delete" | null;
  }>({ open: false, action: null });

  const [state, formAction] = useActionState(
    updateUserStatus.bind(null, userId, "ACTIVE"),
    null
  );

  const handleAction = (action: "suspend" | "activate" | "delete") => {
    setConfirmDialog({ open: true, action });
  };

  const confirmAction = () => {
    if (!confirmDialog.action) return;

    let status: "ACTIVE" | "SUSPENDED" | "DELETED";
    if (confirmDialog.action === "suspend") {
      status = "SUSPENDED";
    } else if (confirmDialog.action === "activate") {
      status = "ACTIVE";
    } else {
      status = "DELETED";
    }

    startTransition(async () => {
      const formData = new FormData();
      const result = await updateUserStatus(userId, status, null, formData);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
      setConfirmDialog({ open: false, action: null });
    });
  };

  const getDialogContent = () => {
    switch (confirmDialog.action) {
      case "suspend":
        return {
          title: "Suspend User",
          description: "Are you sure you want to suspend this user? They will not be able to access their account.",
          confirmText: "Suspend",
        };
      case "activate":
        return {
          title: "Activate User",
          description: "Are you sure you want to activate this user? They will regain access to their account.",
          confirmText: "Activate",
        };
      case "delete":
        return {
          title: "Delete User",
          description: "Are you sure you want to delete this user? This action cannot be undone.",
          confirmText: "Delete",
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure?",
          confirmText: "Confirm",
        };
    }
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== "ACTIVE" && (
            <DropdownMenuItem
              onClick={() => handleAction("activate")}
              disabled={isPending}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          {currentStatus !== "SUSPENDED" && currentStatus !== "DELETED" && (
            <DropdownMenuItem
              onClick={() => handleAction("suspend")}
              disabled={isPending}
            >
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          )}
          {currentStatus !== "DELETED" && (
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              disabled={isPending}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, action: confirmDialog.action })
        }
        title={dialogContent.title}
        description={dialogContent.description}
        onConfirm={confirmAction}
        confirmText={dialogContent.confirmText}
        variant="destructive"
      />
    </>
  );
}

