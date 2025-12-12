"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Ban,
  CheckCircle,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserStatus } from "@/services/admin/updateUserStatus";
import { verifyUser } from "@/services/admin/verifyUser";
import { updateUserRole } from "@/services/admin/updateUserRole";
import { deleteUser } from "@/services/admin/deleteUser";
import { toast } from "sonner";
import ConfirmActionDialog from "./ConfirmActionDialog";
import { UserRole } from "@/lib/auth-utils";

interface UserActionsProps {
  userId: string;
  currentStatus: "ACTIVE" | "SUSPENDED" | "DELETED";
  isVerified?: boolean;
  currentRole?: UserRole;
  currentAdminId: string;
}

export default function UserActions({
  userId,
  currentStatus,
  isVerified = false,
  currentRole = "USER",
  currentAdminId,
}: UserActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "suspend" | "activate" | "delete" | "verify" | "unverify" | null;
  }>({ open: false, action: null });
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const isSelf = userId === currentAdminId;

  const handleAction = (
    action: "suspend" | "activate" | "delete" | "verify" | "unverify"
  ) => {
    setConfirmDialog({ open: true, action });
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (isSelf) {
      toast.error("You cannot change your own role");
      return;
    }
    setPendingRole(newRole);
    setRoleDialogOpen(true);
  };

  const confirmRoleChange = () => {
    if (!pendingRole) return;

    startTransition(async () => {
      const result = await updateUserRole(userId, pendingRole);
      if (result.success) {
        toast.success(result.message);
        startTransition(() => router.refresh());
      } else {
        toast.error(result.message || "Failed to update user role");
      }
      setRoleDialogOpen(false);
      setPendingRole(null);
    });
  };

  const confirmAction = () => {
    if (!confirmDialog.action) return;

    if (isSelf) {
      let message = "";
      switch (confirmDialog.action) {
        case "suspend":
        case "activate":
          message = "You cannot modify your own status";
          break;
        case "delete":
          message = "You cannot delete your own account";
          break;
        case "verify":
        case "unverify":
          message = "You cannot modify your own verification status";
          break;
      }
      toast.error(message);
      setConfirmDialog({ open: false, action: null });
      return;
    }

    startTransition(async () => {
      let result;
      switch (confirmDialog.action) {
        case "suspend":
        case "activate": {
          const status =
            confirmDialog.action === "suspend" ? "SUSPENDED" : "ACTIVE";
          const formData = new FormData();
          result = await updateUserStatus(userId, status, null, formData);
          break;
        }
        case "delete": {
          result = await deleteUser(userId);
          break;
        }
        case "verify": {
          result = await verifyUser(userId, true);
          break;
        }
        case "unverify": {
          result = await verifyUser(userId, false);
          break;
        }
        default:
          return;
      }

      if (result.success) {
        toast.success(result.message);
        startTransition(() => router.refresh());
      } else {
        toast.error(result.message || "Failed to perform action");
      }
      setConfirmDialog({ open: false, action: null });
    });
  };

  const getDialogContent = () => {
    switch (confirmDialog.action) {
      case "suspend":
        return {
          title: "Suspend User",
          description:
            "Are you sure you want to suspend this user? They will not be able to access their account.",
          confirmText: "Suspend",
        };
      case "activate":
        return {
          title: "Activate User",
          description:
            "Are you sure you want to activate this user? They will regain access to their account.",
          confirmText: "Activate",
        };
      case "delete":
        return {
          title: "Delete User",
          description:
            "Are you sure you want to delete this user? This action cannot be undone.",
          confirmText: "Delete",
        };
      case "verify":
        return {
          title: "Verify User",
          description:
            "Are you sure you want to verify this user? They will be marked as verified.",
          confirmText: "Verify",
        };
      case "unverify":
        return {
          title: "Unverify User",
          description:
            "Are you sure you want to unverify this user? They will be marked as unverified.",
          confirmText: "Unverify",
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
        <DropdownMenuContent align="end" className="w-48">
          {/* Status Actions */}
          {currentStatus !== "ACTIVE" && (
            <DropdownMenuItem
              onClick={() => handleAction("activate")}
              disabled={isPending || isSelf}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate
            </DropdownMenuItem>
          )}
          {currentStatus !== "SUSPENDED" &&
            currentStatus !== "DELETED" && (
              <DropdownMenuItem
                onClick={() => handleAction("suspend")}
                disabled={isPending || isSelf}
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend
              </DropdownMenuItem>
            )}

          <DropdownMenuSeparator />

          {/* Verification Actions */}
          {!isVerified ? (
            <DropdownMenuItem
              onClick={() => handleAction("verify")}
              disabled={isPending || isSelf}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleAction("unverify")}
              disabled={isPending || isSelf}
            >
              <ShieldX className="mr-2 h-4 w-4" />
              Unverify
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Role Update */}
          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-1">Change Role</div>
            <Select
              value={currentRole}
              onValueChange={(value) =>
                handleRoleChange(value as UserRole)
              }
              disabled={isPending || isSelf}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />

          {/* Delete Action */}
          {currentStatus !== "DELETED" && (
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              disabled={isPending || isSelf}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}

          {/* Self-modification warning */}
          {isSelf && (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                You cannot modify your own account
              </div>
            </>
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

      <ConfirmActionDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        title="Change User Role"
        description={`Are you sure you want to change this user's role to ${pendingRole || "the selected role"}?`}
        onConfirm={confirmRoleChange}
        confirmText="Change Role"
        variant="default"
      />
    </>
  );
}
