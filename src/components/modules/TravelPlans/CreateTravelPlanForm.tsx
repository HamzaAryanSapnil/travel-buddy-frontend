"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { createTravelPlan } from "@/services/travelPlans/createTravelPlan";
import InputFieldError from "@/components/shared/InputFieldError";
import DatePicker from "@/components/shared/DatePicker";
import ImageUpload from "@/components/shared/ImageUpload";
import TravelTypeSelector from "./TravelTypeSelector";
import VisibilitySelector from "./VisibilitySelector";
import BudgetInput from "./BudgetInput";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { formatCharacterCount } from "@/lib/formatters";
import { IInputErrorState } from "@/lib/getInputFieldError";

const CreateTravelPlanForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createTravelPlan, null);

  // Form state
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelType, setTravelType] = useState("FRIENDS");
  const [budgetMin, setBudgetMin] = useState<number | undefined>();
  const [budgetMax, setBudgetMax] = useState<number | undefined>();
  const [currency, setCurrency] = useState("USD");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string>("");

  // Dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Check if form has data
  const hasFormData = () => {
    return !!(
      title ||
      destination ||
      origin ||
      startDate ||
      endDate ||
      description ||
      coverPhoto ||
      budgetMin ||
      budgetMax
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("destination", destination);
    if (origin) formData.append("origin", origin);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("travelType", travelType);
    if (budgetMin) formData.append("budgetMin", budgetMin.toString());
    if (budgetMax) formData.append("budgetMax", budgetMax.toString());
    formData.append("visibility", visibility);
    if (description) formData.append("description", description);
    if (coverPhotoUrl) formData.append("coverPhoto", coverPhotoUrl);
    // Note: File upload to backend will be handled separately if needed

    formAction(formData);
  };

  // Handle success/error
  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success("Travel plan created successfully!");
        // Redirect is handled in server action
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state]);

  // Handle cancel
  const handleCancel = () => {
    if (hasFormData()) {
      setShowCancelDialog(true);
    } else {
      router.push("/dashboard/travel-plans");
    }
  };

  const handleConfirmCancel = () => {
    router.push("/dashboard/travel-plans");
  };

  // Calculate min date for end date picker
  const getEndDateMin = () => {
    if (startDate) {
      // End date should be at least start date
      return startDate;
    }
    // If no start date, use tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
            <p className="text-sm text-muted-foreground">
              Provide the essential details about your travel plan
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">
                Plan Title <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Summer Trip to Europe"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={200}
                aria-invalid={!!(state && getInputFieldError("title", state))}
              />
              <FieldDescription>
                Between 3 and 200 characters
              </FieldDescription>
              <InputFieldError field="title" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="destination">
                Destination <span className="text-destructive ml-1">*</span>
              </FieldLabel>
              <Input
                id="destination"
                name="destination"
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                aria-invalid={!!(state && getInputFieldError("destination", state))}
              />
              <InputFieldError field="destination" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="origin">Origin</FieldLabel>
              <Input
                id="origin"
                name="origin"
                type="text"
                placeholder="Where are you starting from?"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                aria-invalid={!!(state && getInputFieldError("origin", state))}
              />
              <InputFieldError field="origin" state={state} />
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        {/* Dates & Type Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Dates & Type</h2>
            <p className="text-sm text-muted-foreground">
              When are you traveling and what type of trip is this?
            </p>
          </div>

          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  required
                  placeholder="Select start date"
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
                  required
                  placeholder="Select end date"
                  state={state}
                  fieldName="endDate"
                />
              </Field>
            </div>

            <Field>
              <TravelTypeSelector
                value={travelType}
                onChange={setTravelType}
                state={state}
                fieldName="travelType"
              />
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        {/* Budget & Visibility Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Budget & Visibility</h2>
            <p className="text-sm text-muted-foreground">
              Set your budget and choose who can see this plan
            </p>
          </div>

          <FieldGroup>
            <Field>
              <BudgetInput
                minValue={budgetMin}
                maxValue={budgetMax}
                onMinChange={setBudgetMin}
                onMaxChange={setBudgetMax}
                currency={currency}
                onCurrencyChange={setCurrency}
                state={state}
              />
            </Field>

            <Field>
              <VisibilitySelector
                value={visibility}
                onChange={setVisibility}
                state={state}
                fieldName="visibility"
              />
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        {/* Additional Details Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Additional Details</h2>
            <p className="text-sm text-muted-foreground">
              Add a description and cover photo for your plan
            </p>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your travel plan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={6}
                aria-invalid={!!(state && getInputFieldError("description", state))}
              />
              <FieldDescription>
                {formatCharacterCount(description.length, 2000)}
              </FieldDescription>
              <InputFieldError field="description" state={state} />
            </Field>

            <Field>
              <ImageUpload
                value={coverPhoto}
                onChange={(file) => {
                  setCoverPhoto(file);
                  // Note: File upload to get URL will be handled in the service
                  // For now, we store the file and handle upload in createTravelPlan service
                  // The API expects coverPhoto as a URL string, so we'll need to upload first
                }}
                label="Cover Photo"
              />
              <FieldDescription>
                Optional. Upload a cover photo for your travel plan (max 5MB)
              </FieldDescription>
              <InputFieldError field="coverPhoto" state={state} />
            </Field>
          </FieldGroup>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Plan"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to leave? All your changes will be lost."
        onConfirm={handleConfirmCancel}
        confirmText="Discard"
        cancelText="Keep Editing"
      />
    </>
  );
};

// Helper function to get error from state
function getInputFieldError(
  fieldName: string,
  state: IInputErrorState | null
): string | null {
  if (state && state.errors) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  }
  return null;
}

export default CreateTravelPlanForm;

