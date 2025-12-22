"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Clock, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import JoinRequestModal from "./JoinRequestModal";
import { toast } from "sonner";
import { TravelPlan } from "@/types/travelPlan.interface";
import { isPlanCompleted, isPlanOngoing } from "@/utils/planDateHelpers";

interface JoinRequestButtonProps {
  planId: string;
  planTitle: string;
  plan: TravelPlan;
  isAuthenticated: boolean;
  isMember?: boolean;
  requestStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
}

export default function JoinRequestButton({
  planId,
  planTitle,
  plan,
  isAuthenticated,
  isMember = false,
  requestStatus = null,
}: JoinRequestButtonProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Local state to update UI immediately after successful request without waiting for full revalidation
  const [currentStatus, setCurrentStatus] = useState<typeof requestStatus>(requestStatus);

  // Check if plan is completed or ongoing - disable request button in both cases
  const isCompleted = isPlanCompleted(plan.startDate, plan.endDate);
  const isOngoing = isPlanOngoing(plan.startDate, plan.endDate);
  const shouldDisableRequest = isCompleted || isOngoing;

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/travel-plans/${planId}`);
      return;
    }
    if (shouldDisableRequest) {
      return;
    }
    setModalOpen(true);
  };

  const handleSuccess = () => {
    setCurrentStatus("PENDING");
    router.refresh(); // Refresh to update server-side data if needed
  };

  if (isMember || currentStatus === "APPROVED") {
    return (
      <Button variant="secondary" disabled className="w-full sm:w-auto">
        <Check className="mr-2 h-4 w-4" />
        Member
      </Button>
    );
  }

  if (currentStatus === "PENDING") {
    return (
      <Button variant="secondary" disabled className="w-full sm:w-auto cursor-not-allowed opacity-70">
        <Clock className="mr-2 h-4 w-4" />
        Request Pending
      </Button>
    );
  }

  // If REJECTED, user can request again (business logic assumption based on roadmap)
  // or show "Request Rejected" if we want to block re-requests. 
  // Roadmap says: "After a request is APPROVED or REJECTED, users can submit a new request"
  
  return (
    <>
      <Button 
        onClick={handleClick} 
        className="w-full sm:w-auto"
        disabled={shouldDisableRequest}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        {currentStatus === "REJECTED" ? "Request Again" : "Request to Join"}
      </Button>

      <JoinRequestModal
        planId={planId}
        planTitle={planTitle}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}

