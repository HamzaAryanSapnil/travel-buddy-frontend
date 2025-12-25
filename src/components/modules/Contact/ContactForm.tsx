"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/services/contact/submitContactForm";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Your message has been sent successfully!");
      // Reset form by navigating to a new page or using form.reset()
      if (typeof document !== "undefined") {
        const form = document.querySelector('form') as HTMLFormElement;
        if (form) {
          form.reset();
        }
      }
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">Your Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              minLength={2}
            />
            <FieldDescription>Minimum 2 characters required</FieldDescription>
            {state && <InputFieldError field="name" state={state as IInputErrorState} />}
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Your Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
            {state && <InputFieldError field="email" state={state as IInputErrorState} />}
          </Field>

          {/* Subject */}
          <Field>
            <FieldLabel htmlFor="subject">Subject</FieldLabel>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this regarding?"
              required
              minLength={3}
            />
            <FieldDescription>Minimum 3 characters required</FieldDescription>
            {state && <InputFieldError field="subject" state={state as IInputErrorState} />}
          </Field>

          {/* Message */}
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Tell us how we can help..."
              required
              minLength={10}
            />
            <FieldDescription>Minimum 10 characters required</FieldDescription>
            {state && <InputFieldError field="message" state={state as IInputErrorState} />}
          </Field>
        </div>

        <FieldGroup className="mt-6">
          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}


