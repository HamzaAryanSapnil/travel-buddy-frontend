"use client";

import {
  useActionState,
  useState,
  useTransition,
  useEffect,
  useMemo,
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
import { createItineraryItem } from "@/services/itinerary/createItineraryItem";
import { updateItineraryItem } from "@/services/itinerary/updateItineraryItem";
import { TravelPlan } from "@/types/travelPlan.interface";
import { ItineraryItem } from "@/types/itinerary.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import DateTimeInput from "./DateTimeInput";
import DaySelector from "./DaySelector";
import InputFieldError from "@/components/shared/InputFieldError";

interface ItineraryItemFormDialogProps {
  plan: TravelPlan;
  mode: "create" | "edit";
  item?: ItineraryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDayIndex?: number;
}

export default function ItineraryItemFormDialog({
  plan,
  mode,
  item,
  open,
  onOpenChange,
  defaultDayIndex = 1,
}: ItineraryItemFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize form state based on mode
  const initialDayIndex =
    mode === "edit" && item ? item.dayIndex : defaultDayIndex;
  const initialTitle = mode === "edit" && item ? item.title : "";
  const initialDescription =
    mode === "edit" && item ? item.description || "" : "";

  // Format datetime for input field
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
  };

  const initialStartAt =
    mode === "edit" && item ? formatDateTime(item.startAt) : "";
  const initialEndAt =
    mode === "edit" && item ? formatDateTime(item.endAt) : "";

  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [startAtValue, setStartAtValue] = useState<string>(initialStartAt);
  const [endAtValue, setEndAtValue] = useState<string>(initialEndAt);

  // Calculate total days
  const planStartDateStr = plan.startDate;
  const planEndDateStr = plan.endDate;
  const planStartDate = useMemo(
    () => (planStartDateStr ? new Date(planStartDateStr) : null),
    [planStartDateStr]
  );
  const planEndDate = useMemo(
    () => (planEndDateStr ? new Date(planEndDateStr) : null),
    [planEndDateStr]
  );
  const totalDays =
    planStartDate && planEndDate
      ? Math.ceil(
          (planEndDate.getTime() - planStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

  // Create form action based on mode
  // Ensure item exists when in edit mode
  if (mode === "edit" && !item) {
    throw new Error("Item is required when mode is 'edit'");
  }

  const [state, formAction] = useActionState(
    mode === "create"
      ? createItineraryItem.bind(null, plan.id)
      : updateItineraryItem.bind(null, plan.id, item!.id),
    null
  );

  // Compute min/max dates using useMemo
  const minMaxDates = useMemo(() => {
    if (!plan.startDate || !plan.endDate || !planStartDate || !planEndDate) {
      return null;
    }
    const currentDayDate = new Date(planStartDate);
    currentDayDate.setDate(planStartDate.getDate() + (selectedDayIndex - 1));

    const min = format(currentDayDate, "yyyy-MM-dd'T'00:00");
    const max = format(currentDayDate, "yyyy-MM-dd'T'23:59");
    const validRangeText = `Valid range: ${format(
      currentDayDate,
      "MMM d, yyyy"
    )} (Day ${selectedDayIndex})`;

    return { min, max, validRangeText };
  }, [
    selectedDayIndex,
    plan.startDate,
    plan.endDate,
    planStartDate,
    planEndDate,
  ]);

  // Compute default times using useMemo (for create mode)
  const defaultTimes = useMemo(() => {
    if (!minMaxDates || !planStartDate || mode !== "create") {
      return { start: "", end: "" };
    }
    const currentDayDate = new Date(planStartDate);
    currentDayDate.setDate(planStartDate.getDate() + (selectedDayIndex - 1));

    const defaultStart = new Date(currentDayDate);
    defaultStart.setHours(9, 0, 0, 0);
    const start = format(defaultStart, "yyyy-MM-dd'T'HH:mm");

    const defaultEnd = new Date(currentDayDate);
    defaultEnd.setHours(10, 0, 0, 0);
    const end = format(defaultEnd, "yyyy-MM-dd'T'HH:mm");

    return { start, end };
  }, [selectedDayIndex, minMaxDates, planStartDate, mode]);

  // Initialize default times when dialog opens in create mode
  useEffect(() => {
    if (
      open &&
      mode === "create" &&
      defaultTimes.start &&
      defaultTimes.end &&
      !startAtValue
    ) {
      startTransition(() => {
        setStartAtValue(defaultTimes.start);
        setEndAtValue(defaultTimes.end);
      });
    }
  }, [
    open,
    mode,
    defaultTimes.start,
    defaultTimes.end,
    startAtValue,
    startTransition,
  ]);

  // Auto-adjust end time when start time changes (create mode only)
  useEffect(() => {
    if (mode === "create" && startAtValue && minMaxDates) {
      const start = new Date(startAtValue);
      const suggestedEnd = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour
      const maxAllowedEnd = new Date(minMaxDates.max);

      const finalEnd =
        suggestedEnd > maxAllowedEnd ? maxAllowedEnd : suggestedEnd;
      const newEndAtValue = format(finalEnd, "yyyy-MM-dd'T'HH:mm");

      if (endAtValue !== newEndAtValue) {
        startTransition(() => {
          setEndAtValue(newEndAtValue);
        });
      }
    }
  }, [mode, startAtValue, minMaxDates, endAtValue, startTransition]);

  // Handle success/error with useEffect (simplified like EditTravelPlanDialog)
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : mode === "create"
          ? "Itinerary item created successfully"
          : "Itinerary item updated successfully";

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
          ? "Failed to create itinerary item"
          : "Failed to update itinerary item";

      toast.error(message);
    }
  }, [state, onOpenChange, router, mode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("dayIndex", String(selectedDayIndex));
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    if (startAtValue) {
      formData.append("startAt", startAtValue);
    }
    if (endAtValue) {
      formData.append("endAt", endAtValue);
    }

    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Activity" : "Edit Activity"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day Select */}
          <DaySelector
            name="dayIndex"
            label="Day"
            value={selectedDayIndex}
            onChange={setSelectedDayIndex}
            totalDays={totalDays}
            required
            state={state}
            fieldName="dayIndex"
          />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Activity Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Visit Eiffel Tower"
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
              placeholder="Add details about this activity..."
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {state && <InputFieldError field="description" state={state} />}
          </div>

          {/* Start Time */}
          <DateTimeInput
            id="startAt"
            name="startAt"
            label="Start Time"
            value={startAtValue}
            onChange={setStartAtValue}
            min={minMaxDates?.min}
            max={minMaxDates?.max}
            helperText={minMaxDates?.validRangeText}
            state={state}
            fieldName="startAt"
          />

          {/* End Time */}
          <DateTimeInput
            id="endAt"
            name="endAt"
            label="End Time"
            value={endAtValue}
            onChange={setEndAtValue}
            min={minMaxDates?.min}
            max={minMaxDates?.max}
            helperText={minMaxDates?.validRangeText}
            state={state}
            fieldName="endAt"
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
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                ? "Add Activity"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
