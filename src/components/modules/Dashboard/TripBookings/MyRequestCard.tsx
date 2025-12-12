"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TripBooking } from "@/types/tripBooking.interface";
import { Calendar, MapPin, XCircle } from "lucide-react";
import { cancelRequest } from "@/services/tripBookings/cancelRequest";
import { toast } from "sonner";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MyRequestCardProps {
  booking: TripBooking;
}

export default function MyRequestCard({ booking }: MyRequestCardProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelRequest(booking.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to cancel request");
    } finally {
      setIsCancelling(false);
      setShowConfirm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Image Section */}
            <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-muted">
              {booking?.plan?.coverPhoto ? (
                <Image
                  src={booking?.plan?.coverPhoto}
                  alt={booking?.plan?.title || "Travel Plan"}
                  fill
                  className="object-cover"
                  unoptimized={booking?.plan?.coverPhoto?.includes("i.ibb.co")}
                  onError={(e) => {
                    console.error("Image load error:", booking?.plan?.coverPhoto);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <MapPin className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {booking.plan?.title}
                  </h3>
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.plan?.destination}</span>
                  </div>
                  {booking.plan?.startDate && booking.plan?.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(booking.plan.startDate), "MMM d, yyyy")} -{" "}
                        {format(new Date(booking.plan.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                </div>

                {booking.message && (
                  <div className="mt-4 bg-muted/50 p-3 rounded-md text-sm italic">
                    "{booking.message}"
                  </div>
                )}
              </div>

              {booking.status === "PENDING" && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowConfirm(true)}
                    disabled={isCancelling}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Request
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Cancel Request"
        description="Are you sure you want to cancel this join request? This action cannot be undone."
        onConfirm={handleCancel}
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
      />
    </>
  );
}

