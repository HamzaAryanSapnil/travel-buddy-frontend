"use client";

import { Input } from "@/components/ui/input";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import InputFieldError from "./InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  state?: IInputErrorState;
  fieldName?: string;
}

const DatePicker = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = "Select date",
  label,
  required = false,
  error,
  state,
  fieldName,
}: DatePickerProps) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];
  
  // Calculate min date (tomorrow if no minDate provided)
  const getMinDate = () => {
    if (minDate) return minDate;
    // If no minDate, return tomorrow for future date requirement
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const displayError = error || (state && fieldName ? getInputFieldError(fieldName, state) : null);

  return (
    <div className="w-full">
      {label && (
        <FieldLabel htmlFor={fieldName || "date-picker"}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      <Input
        id={fieldName || "date-picker"}
        type="date"
        value={value || ""}
        onChange={handleChange}
        min={getMinDate()}
        max={maxDate}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={cn(
          displayError && "border-destructive focus-visible:ring-destructive/20"
        )}
        aria-invalid={!!displayError}
      />
      {displayError && (
        <FieldDescription className="text-destructive mt-1">
          {displayError}
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

export default DatePicker;

