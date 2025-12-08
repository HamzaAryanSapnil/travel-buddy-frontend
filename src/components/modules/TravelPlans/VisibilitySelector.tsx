"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Globe, Lock, Link as LinkIcon } from "lucide-react";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";

interface VisibilitySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  state?: IInputErrorState;
  fieldName?: string;
}

const visibilityOptions = [
  {
    value: "PUBLIC",
    label: "Public",
    description: "Anyone can view this plan",
    icon: Globe,
  },
  {
    value: "PRIVATE",
    label: "Private",
    description: "Only invited members can view",
    icon: Lock,
  },
  {
    value: "UNLISTED",
    label: "Unlisted",
    description: "Only people with the link can view",
    icon: LinkIcon,
  },
];

const VisibilitySelector = ({
  value = "PRIVATE",
  onChange,
  error,
  state,
  fieldName = "visibility",
}: VisibilitySelectorProps) => {
  return (
    <div className="w-full">
      <FieldLabel>
        Visibility <span className="text-destructive ml-1">*</span>
      </FieldLabel>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="mt-2"
        aria-invalid={!!(error || (state && getInputFieldError(fieldName, state)))}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`visibility-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`visibility-${option.value}`}
                  className="flex flex-col items-start rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
      {state && <InputFieldError field={fieldName} state={state} />}
      {error && (
        <FieldDescription className="text-destructive mt-1">
          {error}
        </FieldDescription>
      )}
    </div>
  );
};

// Helper function to get error from state
function getInputFieldError(
  fieldName: string,
  state: IInputErrorState
): string | null {
  if (state && state.errors) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  }
  return null;
}

export default VisibilitySelector;

