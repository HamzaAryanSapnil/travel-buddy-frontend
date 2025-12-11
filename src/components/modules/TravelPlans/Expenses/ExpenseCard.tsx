import { Expense } from "@/types/expense.interface";
import { TravelPlan } from "@/types/travelPlan.interface";
import { TripMember } from "@/types/tripMembers.interface";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, getCategoryLabel } from "@/lib/expense-utils";
import { format } from "date-fns";
import ExpenseActions from "./ExpenseActions";

interface ExpenseCardProps {
  expense: Expense;
  members: TripMember[];
  plan: TravelPlan;
  isEditor: boolean;
  currentUserId?: string;
}

export default function ExpenseCard({
  expense,
  members,
  plan,
  isEditor,
  currentUserId,
}: ExpenseCardProps) {
  const paidByMember = members.find((m) => m.userId === expense.paidBy);
  const paidByName = paidByMember?.user.fullName || paidByMember?.user.email || "Unknown";

  const expenseDate = expense.expenseDate
    ? new Date(expense.expenseDate)
    : new Date(expense.createdAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">{expense.title}</h3>
              <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
            </div>
            {expense.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {expense.description}
              </p>
            )}
          </div>
          {isEditor && (
            <ExpenseActions
              expense={expense}
              planId={plan.id}
              members={members}
              plan={plan}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-xl font-bold">{formatCurrency(expense.amount)}</span>
          </div>

          {/* Paid By */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Paid By</span>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={paidByMember?.user.profileImage || undefined}
                  alt={paidByName}
                />
                <AvatarFallback className="text-xs">
                  {paidByName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{paidByName}</span>
            </div>
          </div>

          {/* Split Details */}
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Split {expense.splitType === "EQUAL" ? "Equally" : "Custom"}:
            </p>
            <div className="space-y-1">
              {expense.splits.map((split) => {
                const splitMember = members.find((m) => m.userId === split.userId);
                const splitName =
                  splitMember?.user.fullName || splitMember?.user.email || "Unknown";
                const isCurrentUser = split.userId === currentUserId;
                return (
                  <div
                    key={split.userId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className={isCurrentUser ? "font-medium" : ""}>
                      {splitName}
                      {isCurrentUser && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          You
                        </Badge>
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(split.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {format(expenseDate, "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

