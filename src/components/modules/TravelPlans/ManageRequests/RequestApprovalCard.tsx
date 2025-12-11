"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripBooking } from "@/types/tripBooking.interface";
import { Check, X, Loader2, User, MessageSquare } from "lucide-react";
import { respondToRequest } from "@/services/tripBookings/respondToRequest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RequestApprovalCardProps {
  booking: TripBooking;
  planId: string;
}

export default function RequestApprovalCard({
  booking,
  planId,
}: RequestApprovalCardProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResponse = async (status: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    try {
      const result = await respondToRequest(booking.id, status, planId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* User Info */}
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={booking.user?.profileImage} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(booking.user?.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{booking.user?.fullName || "Unknown User"}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {booking.user?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requested on {format(new Date(booking.createdAt), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => handleResponse("REJECTED")}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={() => handleResponse("APPROVED")}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Message */}
        {booking.message && (
          <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm border-l-4 border-primary/20">
            <div className="flex items-center gap-2 mb-1 text-xs font-semibold text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              Message:
            </div>
            <p className="italic text-muted-foreground">"{booking.message}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

