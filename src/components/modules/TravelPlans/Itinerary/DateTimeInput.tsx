"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";

interface DateTimeInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  error?: string;
  state?: IInputErrorState;
  fieldName?: string;
  helperText?: string;
}

export default function DateTimeInput({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  placeholder,
  required = false,
  error,
  state,
  fieldName,
  helperText,
}: DateTimeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const displayError = error || (state && fieldName ? getInputFieldError(fieldName, state) : null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type="datetime-local"
        value={value || ""}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={cn(
          displayError && "border-destructive focus-visible:ring-destructive/20"
        )}
        aria-invalid={!!displayError}
      />
      {state && <InputFieldError field={fieldName || name} state={state} />}
      {helperText && !displayError && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

// Helper function to get error from state
function getInputFieldError(
  fieldName: string,
  state: IInputErrorState
): string | null {
  if (!state?.errors || !Array.isArray(state.errors)) {
    return null;
  }

  const fieldError = state.errors.find(
    (err: any) => err.field === fieldName
  );

  return fieldError?.message || null;
}

