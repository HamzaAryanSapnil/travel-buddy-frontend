"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    toast.success("Your Issue Submitted Successfully");
    
    // Reset form
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
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
            <FieldDescription>
              Minimum 2 characters required
            </FieldDescription>
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
            <FieldDescription>
              Minimum 3 characters required
            </FieldDescription>
          </Field>

          {/* Message */}
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <textarea
              id="message"
              name="message"
              rows={6}
              placeholder="Tell us how we can help..."
              required
              minLength={10}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            <FieldDescription>
              Minimum 10 characters required
            </FieldDescription>
          </Field>
        </div>

        <FieldGroup className="mt-6">
          <Field>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default ContactForm;

