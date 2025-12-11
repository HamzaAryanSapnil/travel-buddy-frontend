"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { rsvpMeetup } from "@/services/meetups/rsvpMeetup";
import { RSVP, RSVPStatus } from "@/types/meetup.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Check, X, Clock, HelpCircle } from "lucide-react";

interface RSVPButtonProps {
  meetupId: string;
  planId: string;
  currentRSVP?: RSVP;
  onRSVPChange?: () => void;
}

const rsvpStatusConfig: Record<
  RSVPStatus,
  { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  ACCEPTED: {
    label: "Going",
    icon: <Check className="h-4 w-4" />,
    variant: "default",
  },
  DECLINED: {
    label: "Not Going",
    icon: <X className="h-4 w-4" />,
    variant: "destructive",
  },
  PENDING: {
    label: "Pending",
    icon: <Clock className="h-4 w-4" />,
    variant: "outline",
  },
  MAYBE: {
    label: "Maybe",
    icon: <HelpCircle className="h-4 w-4" />,
    variant: "secondary",
  },
};

export default function RSVPButton({
  meetupId,
  planId,
  currentRSVP,
  onRSVPChange,
}: RSVPButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus>(
    currentRSVP?.status || "PENDING"
  );

  const [state, formAction] = useActionState(
    rsvpMeetup.bind(null, meetupId, planId),
    null
  );

  // Update selected status when currentRSVP changes
  useEffect(() => {
    if (currentRSVP?.status) {
      setSelectedStatus(currentRSVP.status);
    }
  }, [currentRSVP]);

  // Handle success/error with useEffect
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "RSVP updated successfully";

      toast.success(message);
      if (onRSVPChange) {
        onRSVPChange();
      } else {
        router.refresh();
      }
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Failed to update RSVP";

      toast.error(message);
    }
  }, [state, onRSVPChange, router]);

  const handleRSVP = (status: RSVPStatus) => {
    if (isPending) return;

    setSelectedStatus(status);

    const formData = new FormData();
    formData.append("status", status);

    startTransition(() => {
      formAction(formData);
    });
  };

  const currentConfig = rsvpStatusConfig[selectedStatus];

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(rsvpStatusConfig) as RSVPStatus[]).map((status) => {
        const config = rsvpStatusConfig[status];
        const isSelected = selectedStatus === status;

        return (
          <Button
            key={status}
            type="button"
            variant={isSelected ? config.variant : "outline"}
            size="sm"
            onClick={() => handleRSVP(status)}
            disabled={isPending}
            className="gap-2"
          >
            {config.icon}
            {config.label}
            {isSelected && (
              <Badge variant="secondary" className="ml-1">
                Current
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}

