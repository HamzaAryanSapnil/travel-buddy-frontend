"use client";

import {
  useActionState,
  useState,
  useTransition,
  useEffect,
  useMemo,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createExpense } from "@/services/expenses/createExpense";
import { updateExpense } from "@/services/expenses/updateExpense";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import { Expense, ExpenseCategory, ExpenseSplitType } from "@/types/expense.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import DatePicker from "@/components/shared/DatePicker";
import InputFieldError from "@/components/shared/InputFieldError";
import { formatCurrency } from "@/lib/expense-utils";

interface ExpenseFormDialogProps {
  plan: TravelPlan;
  members: TripMember[];
  expense?: Expense;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExpenseFormDialog({
  plan,
  members,
  expense,
  open,
  onOpenChange,
}: ExpenseFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mode = expense ? "edit" : "create";

  // Initialize form state
  const [title, setTitle] = useState(expense?.title || "");
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [category, setCategory] = useState<ExpenseCategory>(
    expense?.category || "OTHER"
  );
  const [paidBy, setPaidBy] = useState(expense?.paidBy || members[0]?.userId || "");
  const [splitType, setSplitType] = useState<ExpenseSplitType>(
    expense?.splitType || "EQUAL"
  );
  const [expenseDate, setExpenseDate] = useState(
    expense?.expenseDate
      ? format(new Date(expense.expenseDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd")
  );
  const [customSplits, setCustomSplits] = useState<
    Array<{ userId: string; amount: string }>
  >(
    expense?.splits.map((s) => ({ userId: s.userId, amount: s.amount.toString() })) ||
      members.map((m) => ({ userId: m.userId, amount: "" }))
  );

  // Calculate equal split amounts
  const equalSplitAmount = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || members.length === 0) return 0;
    const total = parseFloat(amount);
    return total / members.length;
  }, [amount, members.length]);

  // Calculate custom splits total
  const customSplitsTotal = useMemo(() => {
    return customSplits.reduce((sum, split) => {
      const splitAmount = parseFloat(split.amount) || 0;
      return sum + splitAmount;
    }, 0);
  }, [customSplits]);

  // Validate custom splits
  const customSplitsError = useMemo(() => {
    if (splitType !== "CUSTOM") return null;
    const total = parseFloat(amount) || 0;
    const diff = Math.abs(customSplitsTotal - total);
    if (diff > 0.01) {
      return `Total splits (${formatCurrency(customSplitsTotal)}) must equal expense amount (${formatCurrency(total)})`;
    }
    return null;
  }, [splitType, amount, customSplitsTotal]);

  // Create form action based on mode
  if (mode === "edit" && !expense) {
    throw new Error("Expense is required when mode is 'edit'");
  }

  const [state, formAction] = useActionState(
    mode === "create"
      ? createExpense.bind(null, plan.id)
      : updateExpense.bind(null, plan.id, expense!.id),
    null
  );

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setAmount("");
        setCategory("OTHER");
        setPaidBy(members[0]?.userId || "");
        setSplitType("EQUAL");
        setExpenseDate(format(new Date(), "yyyy-MM-dd"));
        setCustomSplits(members.map((m) => ({ userId: m.userId, amount: "" })));
      } else if (expense) {
        setTitle(expense.title);
        setDescription(expense.description || "");
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setPaidBy(expense.paidBy);
        setSplitType(expense.splitType);
        setExpenseDate(
          expense.expenseDate
            ? format(new Date(expense.expenseDate), "yyyy-MM-dd")
            : format(new Date(), "yyyy-MM-dd")
        );
        setCustomSplits(
          expense.splits.map((s) => ({
            userId: s.userId,
            amount: s.amount.toString(),
          }))
        );
      }
    }
  }, [open, mode, expense, members]);

  // Handle success/error with useEffect
  useEffect(() => {
    if (state?.success) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : mode === "create"
          ? "Expense created successfully"
          : "Expense updated successfully";

      toast.success(message);
      onOpenChange(false);
      router.refresh();
    } else if (state && state.success === false && state.message) {
      const message =
        typeof state.message === "string"
          ? state.message
          : typeof state.message === "object" && state.message !== null
          ? JSON.stringify(state.message)
          : mode === "create"
          ? "Failed to create expense"
          : "Failed to update expense";

      toast.error(message);
    }
  }, [state, onOpenChange, router, mode]);

  // Update custom splits when split type changes to EQUAL
  useEffect(() => {
    if (splitType === "EQUAL" && amount && !isNaN(parseFloat(amount))) {
      const splitAmount = equalSplitAmount;
      setCustomSplits(
        members.map((m) => ({
          userId: m.userId,
          amount: splitAmount.toFixed(2),
        }))
      );
    }
  }, [splitType, amount, equalSplitAmount, members]);

  const handleCustomSplitChange = (userId: string, value: string) => {
    setCustomSplits((prev) =>
      prev.map((split) =>
        split.userId === userId ? { ...split, amount: value } : split
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate custom splits
    if (splitType === "CUSTOM" && customSplitsError) {
      toast.error(customSplitsError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("paidBy", paidBy);
    formData.append("splitType", splitType);
    if (expenseDate) {
      formData.append("expenseDate", expenseDate);
    }

    // Prepare splits
    const splits =
      splitType === "EQUAL"
        ? members.map((m) => ({
            userId: m.userId,
            amount: equalSplitAmount,
          }))
        : customSplits
            .filter((s) => s.amount && !isNaN(parseFloat(s.amount)))
            .map((s) => ({
              userId: s.userId,
              amount: parseFloat(s.amount),
            }));

    formData.append("splits", JSON.stringify(splits));

    startTransition(() => {
      formAction(formData);
    });
  };

  const categoryOptions: ExpenseCategory[] = [
    "FOOD",
    "TRANSPORT",
    "ACCOMMODATION",
    "ACTIVITY",
    "SHOPPING",
    "OTHER",
  ];

  const categoryLabels: Record<ExpenseCategory, string> = {
    FOOD: "Food",
    TRANSPORT: "Transport",
    ACCOMMODATION: "Accommodation",
    ACTIVITY: "Activity",
    SHOPPING: "Shopping",
    OTHER: "Other",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Expense" : "Edit Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Dinner at Restaurant"
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {state && <InputFieldError field="title" state={state} />}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add details about this expense..."
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {state && <InputFieldError field="description" state={state} />}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {state && <InputFieldError field="amount" state={state} />}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
              <SelectTrigger id="category" name="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state && <InputFieldError field="category" state={state} />}
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label htmlFor="paidBy">
              Paid By <span className="text-destructive">*</span>
            </Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger id="paidBy" name="paidBy">
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.userId} value={member.userId}>
                    {member.user.fullName || member.user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state && <InputFieldError field="paidBy" state={state} />}
          </div>

          {/* Split Type */}
          <div className="space-y-2">
            <Label>Split Type <span className="text-destructive">*</span></Label>
            <RadioGroup
              value={splitType}
              onValueChange={(value) => setSplitType(value as ExpenseSplitType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EQUAL" id="equal" />
                <Label htmlFor="equal" className="font-normal cursor-pointer">
                  Equal ({members.length} members, {formatCurrency(equalSplitAmount)} each)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CUSTOM" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Custom
                </Label>
              </div>
            </RadioGroup>
            {state && <InputFieldError field="splitType" state={state} />}
          </div>

          {/* Custom Splits */}
          {splitType === "CUSTOM" && (
            <div className="space-y-2">
              <Label>Split Amounts</Label>
              <div className="space-y-2 border rounded-lg p-4">
                {members.map((member) => {
                  const split = customSplits.find((s) => s.userId === member.userId);
                  return (
                    <div key={member.userId} className="flex items-center gap-2">
                      <Label className="flex-1 min-w-0">
                        {member.user.fullName || member.user.email}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={split?.amount || ""}
                        onChange={(e) =>
                          handleCustomSplitChange(member.userId, e.target.value)
                        }
                        className="w-32"
                      />
                    </div>
                  );
                })}
                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span
                    className={
                      customSplitsError ? "text-destructive" : "text-muted-foreground"
                    }
                  >
                    {formatCurrency(customSplitsTotal)} / {formatCurrency(parseFloat(amount) || 0)}
                  </span>
                </div>
                {customSplitsError && (
                  <p className="text-sm text-destructive">{customSplitsError}</p>
                )}
              </div>
              {state && <InputFieldError field="splits" state={state} />}
            </div>
          )}

          {/* Expense Date */}
          <div className="space-y-2">
            <DatePicker
              label="Expense Date"
              value={expenseDate}
              onChange={setExpenseDate}
              minDate={format(new Date(plan.startDate), "yyyy-MM-dd")}
              maxDate={
                (() => {
                  const today = format(new Date(), "yyyy-MM-dd");
                  const planEndDate = format(new Date(plan.endDate), "yyyy-MM-dd");
                  return planEndDate > today ? planEndDate : today;
                })()
              }
            />
            {state && <InputFieldError field="expenseDate" state={state} />}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !!customSplitsError}>
              {isPending
                ? mode === "create"
                  ? "Adding..."
                  : "Saving..."
                : mode === "create"
                ? "Add Expense"
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

