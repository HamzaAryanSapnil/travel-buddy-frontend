import { Expense } from "@/types/expense.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import ExpenseCard from "./ExpenseCard";
import { Card } from "@/components/ui/card";
import { Receipt } from "lucide-react";

interface ExpensesListProps {
  expenses: Expense[];
  members: TripMember[];
  plan: TravelPlan;
  isEditor: boolean;
  currentUserId?: string;
}

export default function ExpensesList({
  expenses,
  members,
  plan,
  isEditor,
  currentUserId,
}: ExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <Receipt className="h-10 w-10 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-medium">No Expenses Yet</h3>
        <p className="text-muted-foreground mt-2">
          {isEditor
            ? "Start tracking expenses by adding your first expense."
            : "No expenses have been added yet."}
        </p>
      </Card>
    );
  }

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => {
    const dateA = a.expenseDate
      ? new Date(a.expenseDate).getTime()
      : new Date(a.createdAt).getTime();
    const dateB = b.expenseDate
      ? new Date(b.expenseDate).getTime()
      : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="space-y-4">
      {sortedExpenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          members={members}
          plan={plan}
          isEditor={isEditor}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}

