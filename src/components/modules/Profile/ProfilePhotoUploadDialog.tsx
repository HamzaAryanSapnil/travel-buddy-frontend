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
import { updateProfilePhoto } from "@/services/profile/updateProfilePhoto";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/shared/ImageUpload";
import InputFieldError from "@/components/shared/InputFieldError";

interface ProfilePhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfilePhotoUploadDialog({
  open,
  onOpenChange,
}: ProfilePhotoUploadDialogProps) {
  const router = useRouter();
  const [isPending] = useTransition();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [state, formAction] = useActionState(updateProfilePhoto, null);

  // Handle success/error with useEffect
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Profile photo updated successfully";

      toast.success(message);
      onOpenChange(false);
      setProfileImage(null); // Reset image
      router.refresh();
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : "Failed to update profile photo";

      toast.error(message);
    }
  }, [state, onOpenChange, router]);

  // Reset image when dialog closes
  useEffect(() => {
    if (!open) {
      setProfileImage(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileImage) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Profile Photo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <ImageUpload
              value={profileImage}
              onChange={setProfileImage}
              maxSize={5 * 1024 * 1024} // 5MB
              label="Profile Photo"
            />
            {state && <InputFieldError field="profileImage" state={state} />}
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
            <Button type="submit" disabled={isPending || !profileImage}>
              {isPending ? "Uploading..." : "Update Photo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

