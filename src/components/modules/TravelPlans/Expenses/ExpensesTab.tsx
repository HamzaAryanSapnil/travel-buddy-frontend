import { Expense } from "@/types/expense.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import ExpensesTabActions from "./ExpensesTabActions";
import ExpenseSummary from "./ExpenseSummary";
import ExpensesList from "./ExpensesList";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

interface ExpensesTabProps {
  plan: TravelPlan;
  expenses: Expense[];
  members: TripMember[];
  expensesError?: string | null;
  currentUserRole?: string;
  currentUserId?: string;
}

export default function ExpensesTab({
  plan,
  expenses,
  members,
  expensesError,
  currentUserRole,
  currentUserId,
}: ExpensesTabProps) {
  const isEditor = ["OWNER", "ADMIN", "EDITOR"].includes(currentUserRole || "");

  // Error State
  if (expensesError) {
    return (
      <Card className="p-6 text-center text-destructive">
        <p>Error: {expensesError}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <ExpensesTabActions plan={plan} members={members} isEditor={isEditor} />

      <Separator />

      {/* Expense Summary */}
      <ExpenseSummary
        expenses={expenses}
        members={members}
        currentUserId={currentUserId}
      />

      <Separator />

      {/* Expenses List */}
      <ExpensesList
        expenses={expenses}
        members={members}
        plan={plan}
        isEditor={isEditor}
        currentUserId={currentUserId}
      />
    </div>
  );
}
