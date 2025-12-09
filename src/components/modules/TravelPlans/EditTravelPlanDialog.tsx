"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import DatePicker from "@/components/shared/DatePicker";
import TravelTypeSelector from "./TravelTypeSelector";
import VisibilitySelector from "./VisibilitySelector";
import BudgetInput from "./BudgetInput";
import MultiImageUpload from "@/components/shared/MultiImageUpload";
import { formatCharacterCount } from "@/lib/formatters";
import InputFieldError from "@/components/shared/InputFieldError";
import { updateTravelPlan } from "@/services/travelPlans/updateTravelPlan";
import { TravelPlan } from "@/types/travelPlan.interface";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditTravelPlanDialogProps {
  plan: TravelPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: () => void;
}

const EditTravelPlanDialog = ({
  plan,
  open,
  onOpenChange,
  onUpdated,
}: EditTravelPlanDialogProps) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    updateTravelPlan.bind(null, plan.id),
    null
  );
  const [isTransitioning, startTransition] = useTransition();

  const [title, setTitle] = useState(plan.title || "");
  const [destination, setDestination] = useState(plan.destination || "");
  const [origin, setOrigin] = useState(plan.origin || "");
  const [startDate, setStartDate] = useState(
    plan.startDate ? plan.startDate.split("T")[0] : ""
  );
  const [endDate, setEndDate] = useState(
    plan.endDate ? plan.endDate.split("T")[0] : ""
  );
  const [travelType, setTravelType] = useState(plan.travelType || "FRIENDS");
  const [budgetMin, setBudgetMin] = useState<number | undefined>(
    plan.budgetMin ?? undefined
  );
  const [budgetMax, setBudgetMax] = useState<number | undefined>(
    plan.budgetMax ?? undefined
  );
  const [currency, setCurrency] = useState("USD");
  const [visibility, setVisibility] = useState(plan.visibility || "PRIVATE");
  const [description, setDescription] = useState(plan.description || "");
  const [files, setFiles] = useState<File[]>([]);

  // Remove useEffect for state sync to avoid setState during render
  // Instead, rely on key prop on the component to force re-mount and re-initialization
  // or use the useEffect above only when strictly necessary (e.g. plan prop changes)

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Travel plan updated");
      onOpenChange(false);
      onUpdated?.();
      router.refresh();
    } else if (state && state.success === false && state.message) {
      toast.error(state.message);
    }
  }, [onOpenChange, onUpdated, router, state]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("destination", destination);
    if (origin) formData.append("origin", origin);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("travelType", travelType);
    if (budgetMin !== undefined)
      formData.append("budgetMin", budgetMin.toString());
    if (budgetMax !== undefined)
      formData.append("budgetMax", budgetMax.toString());
    formData.append("visibility", visibility);
    if (description) formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    startTransition(() => {
      formAction(formData);
    });
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const getEndDateMin = () => {
    if (startDate) {
      return startDate;
    }
    return getMinDate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-11/12 max-w-7xl max-h-[90vh] overflow-y-auto sm:p-6 p-4 rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Travel Plan</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="title">Plan Title</FieldLabel>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={200}
                aria-invalid={
                  !!(
                    state &&
                    state.errors &&
                    state.errors.find(
                      (err: { field: string }) => err.field === "title"
                    )
                  )
                }
              />
              <FieldDescription>Between 3 and 200 characters</FieldDescription>
              <InputFieldError field="title" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="destination">Destination</FieldLabel>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
              <InputFieldError field="destination" state={state} />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1  gap-4">
            <Field>
              <FieldLabel htmlFor="origin">Origin</FieldLabel>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
              <InputFieldError field="origin" state={state} />
            </Field>
            <Field>
              <FieldLabel>Travel Type</FieldLabel>
              <TravelTypeSelector
                value={travelType}
                onChange={(val) => setTravelType(val as typeof travelType)}
              />
              <InputFieldError field="travelType" state={state} />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                minDate={getMinDate()}
                state={state}
                fieldName="startDate"
              />
            </Field>
            <Field>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={getEndDateMin()}
                state={state}
                fieldName="endDate"
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-1  gap-4">
            <Field>
              <FieldLabel>Budget</FieldLabel>
              <BudgetInput
                currency={currency}
                onCurrencyChange={setCurrency}
                minValue={budgetMin}
                maxValue={budgetMax}
                onMinChange={setBudgetMin}
                onMaxChange={setBudgetMax}
              />
              <InputFieldError field="budgetMin" state={state} />
              <InputFieldError field="budgetMax" state={state} />
            </Field>
            <Field>
              <FieldLabel>Visibility</FieldLabel>
              <VisibilitySelector
                value={visibility}
                onChange={(val) => setVisibility(val as typeof visibility)}
              />
              <InputFieldError field="visibility" state={state} />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={4}
            />
            <FieldDescription>
              {formatCharacterCount(description.length, 2000)}
            </FieldDescription>
            <InputFieldError field="description" state={state} />
          </Field>

          <Field>
            <MultiImageUpload
              value={files}
              onChange={setFiles}
              label="Add/Replace Images"
              maxFiles={10}
            />
            <FieldDescription>
              Optional. Upload new images to replace or add to gallery (first
              will become cover).
            </FieldDescription>
            <InputFieldError field="coverPhoto" state={state} />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isTransitioning}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isTransitioning}>
              {isPending || isTransitioning ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTravelPlanDialog;
