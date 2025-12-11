import { Expense, ExpenseCategory, ExpenseSummary } from "@/types/expense.interface";
import { TripMember } from "@/types/tripMembers.interface";

/**
 * Format number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get human-readable category label
 */
export function getCategoryLabel(category: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    FOOD: "Food",
    TRANSPORT: "Transport",
    ACCOMMODATION: "Accommodation",
    ACTIVITY: "Activity",
    SHOPPING: "Shopping",
    OTHER: "Other",
  };
  return labels[category] || category;
}

/**
 * Calculate member balances from expenses
 */
export function calculateMemberBalances(
  expenses: Expense[],
  members: TripMember[]
): Array<{
  userId: string;
  userName: string;
  paid: number;
  owed: number;
  balance: number;
}> {
  const balances = new Map<
    string,
    { userName: string; paid: number; owed: number }
  >();

  // Initialize balances for all members
  members.forEach((member) => {
    balances.set(member.userId, {
      userName: member.user.fullName || member.user.email || "Unknown",
      paid: 0,
      owed: 0,
    });
  });

  // Calculate paid and owed amounts
  expenses.forEach((expense) => {
    // Add to paid amount
    const paidByBalance = balances.get(expense.paidBy);
    if (paidByBalance) {
      paidByBalance.paid += expense.amount;
    }

    // Add to owed amounts from splits
    expense.splits.forEach((split) => {
      const splitBalance = balances.get(split.userId);
      if (splitBalance) {
        splitBalance.owed += split.amount;
      }
    });
  });

  // Convert to array with balance calculation
  return Array.from(balances.entries()).map(([userId, data]) => ({
    userId,
    userName: data.userName,
    paid: data.paid,
    owed: data.owed,
    balance: data.paid - data.owed,
  }));
}

/**
 * Calculate settlements (who should pay whom)
 */
export function calculateSettlements(
  balances: Array<{
    userId: string;
    userName: string;
    paid: number;
    owed: number;
    balance: number;
  }>
): Array<{
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}> {
  const settlements: Array<{
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
  }> = [];

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances.filter((b) => b.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter((b) => b.balance < 0).sort((a, b) => a.balance - b.balance);

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const settlementAmount = Math.min(
      Math.abs(creditor.balance),
      Math.abs(debtor.balance)
    );

    if (settlementAmount > 0.01) {
      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
        amount: settlementAmount,
      });
    }

    creditor.balance -= settlementAmount;
    debtor.balance += settlementAmount;

    if (Math.abs(creditor.balance) < 0.01) {
      creditorIndex++;
    }
    if (Math.abs(debtor.balance) < 0.01) {
      debtorIndex++;
    }
  }

  return settlements;
}

/**
 * Calculate expense summary
 */
export function calculateExpenseSummary(
  expenses: Expense[],
  members: TripMember[]
): ExpenseSummary {
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate by category
  const totalByCategory: Record<ExpenseCategory, number> = {
    FOOD: 0,
    TRANSPORT: 0,
    ACCOMMODATION: 0,
    ACTIVITY: 0,
    SHOPPING: 0,
    OTHER: 0,
  };

  expenses.forEach((expense) => {
    totalByCategory[expense.category] += expense.amount;
  });

  // Calculate member balances
  const memberBalances = calculateMemberBalances(expenses, members);

  // Calculate settlements
  const settlements = calculateSettlements(memberBalances);

  return {
    totalExpenses,
    totalByCategory,
    memberBalances,
    settlements,
  };
}

