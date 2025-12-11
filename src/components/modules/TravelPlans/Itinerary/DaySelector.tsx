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

interface DaySelectorProps {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  totalDays: number;
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
  disabled = false,
  required = false,
  error,
  state,
  fieldName,
}: DaySelectorProps) {
  const handleValueChange = (selectedValue: string) => {
    onChange(Number(selectedValue));
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
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <SelectItem key={day} value={String(day)}>
              Day {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {state && <InputFieldError field={fieldName || name} state={state} />}
    </div>
  );
}

