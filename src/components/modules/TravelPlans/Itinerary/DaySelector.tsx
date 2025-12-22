"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";
import { TravelPlan } from "@/types/travelPlan.interface";
import { isDayPast } from "@/utils/planDateHelpers";

interface DaySelectorProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  totalDays: number;
  plan: TravelPlan;
  disabledDays?: number[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  state?: IInputErrorState;
  fieldName?: string;
}

export default function DaySelector({
  name,
  label,
  value,
  onChange,
  totalDays,
  plan,
  disabledDays = [],
  disabled = false,
  required = false,
  error,
  state,
  fieldName,
}: DaySelectorProps) {
  const handleValueChange = (selectedValue: string) => {
    onChange(Number(selectedValue));
  };

  const isDayDisabled = (day: number): boolean => {
    // Check if day is in explicit disabledDays array
    if (disabledDays.includes(day)) {
      return true;
    }
    // Check if day is past
    return isDayPast(plan.startDate, day);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        name={name}
        value={String(value)}
        onValueChange={handleValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder="Select day" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const dayDisabled = isDayDisabled(day);
            return (
              <SelectItem key={day} value={String(day)} disabled={dayDisabled}>
                Day {day}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {state && <InputFieldError field={fieldName || name} state={state} />}
    </div>
  );
}

