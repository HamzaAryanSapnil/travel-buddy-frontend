"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { deleteAdminTravelPlan } from "@/services/admin/deleteAdminTravelPlan";
import { toggleTravelPlanFeatured } from "@/services/admin/toggleTravelPlanFeatured";
import { toast } from "sonner";
import ConfirmActionDialog from "./ConfirmActionDialog";
import EditTravelPlanDialog from "@/components/modules/TravelPlans/EditTravelPlanDialog";
import { TravelPlan } from "@/types/travelPlan.interface";

interface TravelPlanTableActionsProps {
  plan: TravelPlan;
}

export default function TravelPlanTableActions({
  plan,
}: TravelPlanTableActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "delete" | null;
  }>({ open: false, action: null });
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleFeaturedToggle = () => {
    const newFeaturedStatus = !plan.isFeatured;
    startTransition(async () => {
      const result = await toggleTravelPlanFeatured(plan.id, newFeaturedStatus);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to toggle featured status");
      }
    });
  };

  const handleAction = (action: "edit" | "delete") => {
    if (action === "edit") {
      setEditDialogOpen(true);
    } else {
      setConfirmDialog({ open: true, action: "delete" });
    }
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteAdminTravelPlan(plan.id);
      if (result.success) {
        toast.success(result.message);
        setConfirmDialog({ open: false, action: null });
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete travel plan");
        setConfirmDialog({ open: false, action: null });
      }
    });
  };

  const handleUpdated = () => {
    setEditDialogOpen(false);
    router.refresh();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Featured Toggle */}
          <DropdownMenuItem
            onClick={handleFeaturedToggle}
            disabled={isPending}
          >
            {plan.isFeatured ? (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Remove from Featured
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Mark as Featured
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Edit */}
          <DropdownMenuItem
            onClick={() => handleAction("edit")}
            disabled={isPending}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {/* Delete */}
          <DropdownMenuItem
            onClick={() => handleAction("delete")}
            disabled={isPending}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmActionDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ open, action: confirmDialog.action })
        }
        title="Delete Travel Plan"
        description="Are you sure you want to delete this travel plan? This action cannot be undone."
        onConfirm={confirmDelete}
        confirmText="Delete"
        variant="destructive"
      />

      <EditTravelPlanDialog
        key={editDialogOpen ? "open" : "closed"}
        plan={plan}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdated={handleUpdated}
        isAdmin={true}
      />
    </>
  );
}

