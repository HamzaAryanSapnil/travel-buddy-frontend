"use client";

import React, { useActionState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { addMember } from "@/lib/actions/tripMember.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import InputFieldError from "@/components/shared/InputFieldError";
import {
  getInputFieldError,
  toInputErrorState,
} from "@/lib/getInputFieldError";

interface InviteMemberDialogProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMemberDialog({
  planId,
  open,
  onOpenChange,
}: InviteMemberDialogProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    addMember.bind(null, planId),
    null
  );
  const inputErrorState = toInputErrorState(state);
  const [isTransiting, startTransition] = useTransition();

  // Form state
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<TripRole>("VIEWER");
  const [handledInviteState, setHandledInviteState] = React.useState(state);
  if (state !== handledInviteState) {
    setHandledInviteState(state);
    if (state?.success) {
      setEmail("");
      setRole("VIEWER");
    }
  }

  // Handle success/error
  useEffect(() => {
    if (state) {
      if (state.success) {
        toast.success(state.message || "Member invited successfully!");
        onOpenChange(false);
        router.refresh();
      } else if (state.message) {
        toast.error(state.message);
      }
    }
  }, [state, onOpenChange, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("role", role);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Add a new member to this travel plan. They will receive an email
            notification.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!getInputFieldError("email", inputErrorState)}
            />
            <InputFieldError field="email" state={inputErrorState} />
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Select
              value={role}
              onValueChange={(val) => setRole(val as TripRole)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEWER">Viewer</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <InputFieldError field="role" state={inputErrorState} />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isTransiting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isTransiting}>
              {isPending || isTransiting ? "Inviting..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
