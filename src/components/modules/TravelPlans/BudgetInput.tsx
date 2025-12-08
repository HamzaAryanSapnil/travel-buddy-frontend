"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldLabel, FieldDescription } from "@/components/ui/field";
import { DollarSign } from "lucide-react";
import InputFieldError from "@/components/shared/InputFieldError";
import { IInputErrorState } from "@/lib/getInputFieldError";
import { cn } from "@/lib/utils";

interface BudgetInputProps {
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  errors?: { min?: string; max?: string };
  state?: IInputErrorState;
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "BDT", label: "BDT (৳)" },
];

const BudgetInput = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  currency = "USD",
  onCurrencyChange,
  errors,
  state,
}: BudgetInputProps) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onMinChange(undefined);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onMinChange(numValue);
      }
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      onMaxChange(undefined);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onMaxChange(numValue);
      }
    }
  };

  const minError = errors?.min || (state ? getInputFieldError("budgetMin", state) : null);
  const maxError = errors?.max || (state ? getInputFieldError("budgetMax", state) : null);

  return (
    <div className="w-full space-y-4">
      <div>
        <FieldLabel>Budget (Optional)</FieldLabel>
        <FieldDescription className="mt-1">
          Set a budget range for your trip
        </FieldDescription>
      </div>

      {/* Currency Selector */}
      {onCurrencyChange && (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Budget Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="budgetMin">Minimum Budget</FieldLabel>
          <Input
            id="budgetMin"
            type="number"
            min="0"
            step="0.01"
            value={minValue || ""}
            onChange={handleMinChange}
            placeholder="0.00"
            className={cn(minError && "border-destructive")}
            aria-invalid={!!minError}
          />
          {state && <InputFieldError field="budgetMin" state={state} />}
          {errors?.min && (
            <FieldDescription className="text-destructive mt-1">
              {errors.min}
            </FieldDescription>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="budgetMax">Maximum Budget</FieldLabel>
          <Input
            id="budgetMax"
            type="number"
            min="0"
            step="0.01"
            value={maxValue || ""}
            onChange={handleMaxChange}
            placeholder="0.00"
            className={cn(maxError && "border-destructive")}
            aria-invalid={!!maxError}
          />
          {state && <InputFieldError field="budgetMax" state={state} />}
          {errors?.max && (
            <FieldDescription className="text-destructive mt-1">
              {errors.max}
            </FieldDescription>
          )}
        </div>
      </div>
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

export default BudgetInput;

