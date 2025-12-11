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
import { uploadMedia } from "@/services/media/uploadMedia";
import { TravelPlan } from "@/types/travelPlan.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MultiImageUpload from "@/components/shared/MultiImageUpload";
import InputFieldError from "@/components/shared/InputFieldError";

interface UploadMediaDialogProps {
  plan: TravelPlan;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadMediaDialog({
  plan,
  open,
  onOpenChange,
}: UploadMediaDialogProps) {
  const router = useRouter();
  const [isPending] = useTransition();
  const [files, setFiles] = useState<File[]>([]);

  const [state, formAction] = useActionState(
    uploadMedia.bind(null, plan.id),
    null
  );

  // Handle success/error with useEffect (simplified like EditTravelPlanDialog)
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Media uploaded successfully";

      toast.success(message);
      onOpenChange(false);
      setFiles([]); // Reset files
      router.refresh();
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Failed to upload media";

      toast.error(message);
    }
  }, [state, onOpenChange, router]);

  // Reset files when dialog closes
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <MultiImageUpload
              value={files}
              onChange={setFiles}
              maxFiles={10}
              maxSize={5 * 1024 * 1024} // 5MB
              label="Select Photos"
            />
            {state && <InputFieldError field="files" state={state} />}
          </div>

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
            <Button type="submit" disabled={isPending || files.length === 0}>
              {isPending ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

