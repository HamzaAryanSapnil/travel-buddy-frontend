import { Expense } from "@/types/expense.interface";
import { TripMember } from "@/types/tripMembers.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  calculateExpenseSummary,
  formatCurrency,
  getCategoryLabel,
} from "@/lib/expense-utils";
import { ExpenseCategory } from "@/types/expense.interface";

interface ExpenseSummaryProps {
  expenses: Expense[];
  members: TripMember[];
  currentUserId?: string;
}

export default function ExpenseSummary({
  expenses,
  members,
  currentUserId,
}: ExpenseSummaryProps) {
  if (expenses.length === 0) {
    return null;
  }

  const summary = calculateExpenseSummary(expenses, members);

  return (
    <div className="space-y-6">
      {/* Total Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(summary.totalExpenses)}</p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(Object.keys(summary.totalByCategory) as ExpenseCategory[]).map(
              (category) => {
                const amount = summary.totalByCategory[category];
                if (amount === 0) return null;
                const percentage =
                  summary.totalExpenses > 0
                    ? ((amount / summary.totalExpenses) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{getCategoryLabel(category)}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(amount)}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Member Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Member Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.memberBalances.map((balance) => {
              const member = members.find((m) => m.userId === balance.userId);
              const isCurrentUser = balance.userId === currentUserId;
              return (
                <div
                  key={balance.userId}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrentUser ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={member?.user?.profileImage || undefined}
                        alt={balance.userName}
                      />
                      <AvatarFallback>
                        {balance.userName?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {balance.userName}
                        {isCurrentUser && (
                          <Badge variant="secondary" className="ml-2">
                            You
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Paid: {formatCurrency(balance.paid)} • Owed:{" "}
                        {formatCurrency(balance.owed)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        balance.balance > 0
                          ? "text-green-600"
                          : balance.balance < 0
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {balance.balance > 0
                        ? `+${formatCurrency(balance.balance)}`
                        : formatCurrency(balance.balance)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {balance.balance > 0
                        ? "Owed"
                        : balance.balance < 0
                        ? "Owes"
                        : "Settled"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Settlements */}
      {summary.settlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Settlements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded border"
                >
                  <p className="text-sm">
                    <span className="font-medium">{settlement.fromUserName}</span> should
                    pay{" "}
                    <span className="font-medium">{settlement.toUserName}</span>
                  </p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(settlement.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

