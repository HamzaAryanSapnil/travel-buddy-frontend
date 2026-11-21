"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
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
import { createTravelPlan } from "@/lib/actions/travelPlan.action";
import InputFieldError from "@/components/shared/InputFieldError";
import DatePicker from "@/components/shared/DatePicker";
import MultiImageUpload from "@/components/shared/MultiImageUpload";
import TravelTypeSelector from "./TravelTypeSelector";
import VisibilitySelector from "./VisibilitySelector";
import BudgetInput from "./BudgetInput";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { formatCharacterCount } from "@/lib/formatters";
import {
  getInputFieldError,
  toInputErrorState,
} from "@/lib/getInputFieldError";
import { uploadMultipleToImgBB } from "@/lib/imgbb";

const CreateTravelPlanForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(createTravelPlan, null);
  const inputErrorState = toInputErrorState(state);
  const [isTransiting, startTransition] = useTransition();

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
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

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
      files.length ||
      budgetMin ||
      budgetMax
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let coverPhotoUrl: string | null = null;
    let galleryImageUrls: string[] = [];

    // Upload images to imgBB first if there are files
    if (files.length > 0) {
      setIsUploadingImages(true);
      try {
        const imageUrls = await uploadMultipleToImgBB(files);
        if (imageUrls.length > 0) {
          coverPhotoUrl = imageUrls[0];
          if (imageUrls.length > 1) {
            galleryImageUrls = imageUrls.slice(1);
          }
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to upload images";
        toast.error(errorMsg);
        setIsUploadingImages(false);
        return;
      } finally {
        setIsUploadingImages(false);
      }
    }

    // Build FormData with URLs
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

    // Add image URLs
    if (coverPhotoUrl) {
      formData.append("coverPhoto", coverPhotoUrl);
    }
    if (galleryImageUrls.length > 0) {
      formData.append("galleryImages", JSON.stringify(galleryImageUrls));
    }

    startTransition(() => {
      formAction(formData);
    });
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
                aria-invalid={!!(state && getInputFieldError("title", inputErrorState))}
              />
              <FieldDescription>Between 3 and 200 characters</FieldDescription>
              <InputFieldError field="title" state={inputErrorState} />
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
                aria-invalid={
                  !!(state && getInputFieldError("destination", inputErrorState))
                }
              />
              <InputFieldError field="destination" state={inputErrorState} />
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
                aria-invalid={!!(state && getInputFieldError("origin", inputErrorState))}
              />
              <InputFieldError field="origin" state={inputErrorState} />
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
                  state={inputErrorState}
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
                  state={inputErrorState}
                  fieldName="endDate"
                />
              </Field>
            </div>

            <Field>
              <TravelTypeSelector
                value={travelType}
                onChange={setTravelType}
                state={inputErrorState}
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
                state={inputErrorState}
              />
            </Field>

            <Field>
              <VisibilitySelector
                value={visibility}
                onChange={setVisibility}
                state={inputErrorState}
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
                aria-invalid={
                  !!(state && getInputFieldError("description", inputErrorState))
                }
              />
              <FieldDescription>
                {formatCharacterCount(description.length, 2000)}
              </FieldDescription>
              <InputFieldError field="description" state={inputErrorState} />
            </Field>

            <Field>
              <MultiImageUpload
                value={files}
                onChange={setFiles}
                label="Cover Photo & Gallery Images"
                maxFiles={10}
              />
              <FieldDescription>
                Optional. Upload up to 10 images (first becomes cover). Max 32MB
                each.
              </FieldDescription>
              <InputFieldError field="coverPhoto" state={inputErrorState} />
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
          <Button
            type="submit"
            disabled={isPending || isTransiting || isUploadingImages}
          >
            {isUploadingImages
              ? "Uploading images..."
              : isPending || isTransiting
              ? "Creating..."
              : "Create Plan"}
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

export default CreateTravelPlanForm;
