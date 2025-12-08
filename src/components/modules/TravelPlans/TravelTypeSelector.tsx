"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { User, Heart, Users, UsersRound } from "lucide-react";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";

interface TravelTypeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  state?: IInputErrorState;
  fieldName?: string;
}

const travelTypeOptions = [
  {
    value: "SOLO",
    label: "Solo",
    description: "Traveling alone",
    icon: User,
  },
  {
    value: "COUPLE",
    label: "Couple",
    description: "Traveling with a partner",
    icon: Heart,
  },
  {
    value: "FAMILY",
    label: "Family",
    description: "Family trip",
    icon: Users,
  },
  {
    value: "FRIENDS",
    label: "Friends",
    description: "Trip with friends",
    icon: UsersRound,
  },
  {
    value: "GROUP",
    label: "Group",
    description: "Large group trip",
    icon: UsersRound,
  },
];

const TravelTypeSelector = ({
  value = "FRIENDS",
  onChange,
  error,
  state,
  fieldName = "travelType",
}: TravelTypeSelectorProps) => {
  return (
    <div className="w-full">
      <FieldLabel>
        Travel Type <span className="text-destructive ml-1">*</span>
      </FieldLabel>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="mt-2"
        aria-invalid={!!(error || (state && getInputFieldError(fieldName, state)))}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {travelTypeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`travel-type-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`travel-type-${option.value}`}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Icon className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">
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

export default TravelTypeSelector;

