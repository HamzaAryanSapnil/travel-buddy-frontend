"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TravelPlan } from "@/types/travelPlan.interface";
import Image from "next/image";
import { formatBudgetRange, formatDateRange } from "@/lib/formatters";
import {
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import EditTravelPlanDialog from "./EditTravelPlanDialog";
import { deleteTravelPlan } from "@/services/travelPlans/deleteTravelPlan";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PlanDetailsDialogProps {
  plan: TravelPlan;
  triggerLabel?: string;
  triggerClassName?: string;
}

const PlanDetailsDialog = ({
  plan,
  triggerLabel = "View Details",
  triggerClassName,
}: PlanDetailsDialogProps) => {
  const router = useRouter();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransitioning, startTransition] = useTransition();

  const visibilityLabels: Record<string, string> = {
    PUBLIC: "Public",
    PRIVATE: "Private",
    UNLISTED: "Unlisted",
  };

  const travelTypeLabels: Record<string, string> = {
    SOLO: "Solo",
    COUPLE: "Couple",
    FAMILY: "Family",
    FRIENDS: "Friends",
    GROUP: "Group",
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTravelPlan(plan.id);
      if (result.success) {
        toast.success(result.message || "Travel plan deleted");
        router.refresh();
        setDeleteOpen(false);
      } else {
        toast.error(result.message || "Failed to delete travel plan");
      }
    } catch (error) {
      console.error("Delete plan error:", error);
      toast.error("An error occurred while deleting the plan");
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDetailsOpenEdit = () => {
    setDetailsOpen(false);
    setEditOpen(true);
  };

  const closeDetailsOpenDelete = () => {
    setDetailsOpen(false);
    setDeleteOpen(true);
  };

  const handleUpdated = () => {
    setEditOpen(false);
    setDetailsOpen(false);
    startTransition(() => router.refresh());
  };

  return (
    <>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <Button className={triggerClassName}>{triggerLabel}</Button>
        </DialogTrigger>
        <DialogContent className="w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto sm:p-6 p-4 rounded-lg">
          <DialogHeader className="space-y-1">
            <div className="flex flex-col  sm:items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {plan.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{plan.destination}</span>
                </DialogDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto sm:mr-12">
                <Button variant="default" size="sm" asChild>
                  <Link href={`/dashboard/travel-plans/${plan.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeDetailsOpenEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={closeDetailsOpenDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="relative w-full aspect-[21/9] overflow-hidden rounded-lg bg-muted shadow-sm">
              {plan?.coverPhoto ? (
                <Image
                  src={plan?.coverPhoto}
                  alt={plan?.title || "Travel Plan"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  unoptimized={plan?.coverPhoto?.includes("i.ibb.co")}
                  onError={(e) => {
                    console.error("Image load error:", plan?.coverPhoto);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>No cover photo</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {travelTypeLabels[plan.travelType] || plan.travelType}
              </Badge>
              <Badge
                variant={
                  plan.visibility === "PUBLIC"
                    ? "default"
                    : plan.visibility === "PRIVATE"
                    ? "destructive"
                    : "outline"
                }
              >
                {plan.visibility === "PRIVATE" && (
                  <EyeOff className="h-3 w-3 mr-1" />
                )}
                {plan.visibility === "PUBLIC" && (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                {visibilityLabels[plan.visibility] || plan.visibility}
              </Badge>
              {plan._count?.tripMembers !== undefined && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {plan._count.tripMembers} members
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDateRange(plan.startDate, plan.endDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>{formatBudgetRange(plan.budgetMin, plan.budgetMax)}</span>
              </div>
            </div>

            {plan.description && (
              <div className="text-sm text-muted-foreground leading-relaxed">
                {plan.description}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EditTravelPlanDialog
        key={editOpen ? "open" : "closed"}
        plan={plan}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={handleUpdated}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{plan.title}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PlanDetailsDialog;
