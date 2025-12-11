"use client";

import {
  useActionState,
  useState,
  useTransition,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createMeetup } from "@/services/meetups/createMeetup";
import { updateMeetup } from "@/services/meetups/updateMeetup";
import { TravelPlan } from "@/types/travelPlan.interface";
import { Meetup } from "@/types/meetup.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import DateTimeInput from "@/components/modules/TravelPlans/Itinerary/DateTimeInput";
import InputFieldError from "@/components/shared/InputFieldError";

interface MeetupFormDialogProps {
  plan: TravelPlan;
  meetup?: Meetup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Format datetime for input field (datetime-local format: YYYY-MM-DDTHH:mm)
const formatDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Get minimum datetime (now + 1 minute)
const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return formatDateTime(now.toISOString());
};

export default function MeetupFormDialog({
  plan,
  meetup,
  open,
  onOpenChange,
}: MeetupFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mode = meetup ? "edit" : "create";

  // Initialize form state
  const [title, setTitle] = useState(meetup?.title || "");
  const [description, setDescription] = useState(meetup?.description || "");
  const [location, setLocation] = useState(meetup?.location || "");
  const [videoRoomLink, setVideoRoomLink] = useState(meetup?.videoRoomLink || "");
  const [scheduledAt, setScheduledAt] = useState(
    mode === "edit" && meetup
      ? formatDateTime(meetup.scheduledAt)
      : getMinDateTime()
  );
  const [endAt, setEndAt] = useState(
    mode === "edit" && meetup?.endAt ? formatDateTime(meetup.endAt) : ""
  );

  // Reset form when dialog opens/closes or meetup changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && meetup) {
        setTitle(meetup.title);
        setDescription(meetup.description || "");
        setLocation(meetup.location);
        setVideoRoomLink(meetup.videoRoomLink || "");
        setScheduledAt(formatDateTime(meetup.scheduledAt));
        setEndAt(meetup.endAt ? formatDateTime(meetup.endAt) : "");
      } else {
        setTitle("");
        setDescription("");
        setLocation("");
        setVideoRoomLink("");
        setScheduledAt(getMinDateTime());
        setEndAt("");
      }
    }
  }, [open, mode, meetup]);

  const [state, formAction] = useActionState(
    mode === "create"
      ? createMeetup.bind(null, plan.id)
      : updateMeetup.bind(null, plan.id, meetup!.id),
    null
  );

  // Handle success/error with useEffect
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : mode === "create"
          ? "Meetup created successfully"
          : "Meetup updated successfully";

      toast.success(message);
      onOpenChange(false);
      router.refresh();
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : mode === "create"
          ? "Failed to create meetup"
          : "Failed to update meetup";

      toast.error(message);
    }
  }, [state, onOpenChange, router, mode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    formData.append("location", location);
    if (videoRoomLink) {
      formData.append("videoRoomLink", videoRoomLink);
    }
    formData.append("scheduledAt", scheduledAt);
    if (endAt) {
      formData.append("endAt", endAt);
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  // Calculate max datetime (plan end date or far future)
  const maxDateTime = (() => {
    const planEndDate = new Date(plan.endDate);
    const farFuture = new Date();
    farFuture.setFullYear(farFuture.getFullYear() + 10);
    return formatDateTime(
      planEndDate > farFuture ? planEndDate.toISOString() : farFuture.toISOString()
    );
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Meetup" : "Edit Meetup"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Team Dinner"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {state && <InputFieldError field="title" state={state} />}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add details about this meetup..."
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {state && <InputFieldError field="description" state={state} />}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., Restaurant Name, Address"
              maxLength={500}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            {state && <InputFieldError field="location" state={state} />}
          </div>

          {/* Google Meet Link */}
          <div className="space-y-2">
            <Label htmlFor="videoRoomLink">Google Meet Link (Optional)</Label>
            <Textarea
              id="videoRoomLink"
              name="videoRoomLink"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              rows={2}
              value={videoRoomLink}
              onChange={(e) => setVideoRoomLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Please manually add your Google Meet link here and save it. Join the meeting at the scheduled time.
            </p>
            {state && <InputFieldError field="videoRoomLink" state={state} />}
          </div>

          {/* Scheduled Date/Time */}
          <DateTimeInput
            id="scheduledAt"
            name="scheduledAt"
            label="Scheduled Date & Time"
            value={scheduledAt}
            onChange={setScheduledAt}
            min={mode === "create" ? getMinDateTime() : undefined}
            max={maxDateTime}
            required
            state={state}
            fieldName="scheduledAt"
            helperText="Select when the meetup will start"
          />

          {/* End Date/Time (Optional) */}
          <DateTimeInput
            id="endAt"
            name="endAt"
            label="End Date & Time (Optional)"
            value={endAt}
            onChange={setEndAt}
            min={scheduledAt || getMinDateTime()}
            max={maxDateTime}
            state={state}
            fieldName="endAt"
            helperText="Select when the meetup will end (optional)"
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                ? "Create Meetup"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

