"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendJoinRequest } from "@/services/tripBookings/sendJoinRequest";
import { toast } from "sonner";

interface JoinRequestModalProps {
  planId: string;
  planTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function JoinRequestModal({
  planId,
  planTitle,
  open,
  onOpenChange,
  onSuccess,
}: JoinRequestModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendJoinRequest(planId, message);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Request</DialogTitle>
          <DialogDescription>
            Send a request to join <strong>{planTitle}</strong>. The plan owner
            will review your request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell the owner why you'd like to join..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className="resize-none"
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {message.length}/500
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

