import { UserInfo } from "./user.interface";

export type ExpenseCategory =
  | "FOOD"
  | "TRANSPORT"
  | "ACCOMMODATION"
  | "ACTIVITY"
  | "SHOPPING"
  | "OTHER";

export type ExpenseSplitType = "EQUAL" | "CUSTOM";

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface ExpenseSplitWithUser extends ExpenseSplit {
  user: UserInfo;
}

export interface Expense {
  id: string;
  planId: string;
  title: string;
  description?: string | null;
  amount: number;
  category: ExpenseCategory;
  paidBy: string; // userId
  splitType: ExpenseSplitType;
  splits: ExpenseSplit[];
  expenseDate?: string | null;
  createdAt: string;
  updatedAt: string;
  // Relations
  paidByUser?: UserInfo;
  splitsWithUsers?: ExpenseSplitWithUser[];
}

// Backend response structure (raw API response)
export interface BackendExpenseResponse {
  id: string;
  planId: string;
  payerId: string; // Backend uses payerId
  amount: number;
  currency?: string;
  category: ExpenseCategory;
  description?: string | null; // Backend doesn't have title, only description
  expenseDate?: string | null;
  splitType: ExpenseSplitType;
  locationId?: string | null;
  createdAt: string;
  updatedAt: string;
  payer?: UserInfo; // Backend uses payer
  participants?: Array<{
    id: string;
    expenseId: string;
    userId: string;
    amount: number;
    isPaid?: boolean;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: UserInfo;
  }>; // Backend uses participants instead of splits
  summary?: {
    totalAmount: number;
    participantCount: number;
    settledCount: number;
    isFullySettled: boolean;
  };
}

export interface ExpensesResponse {
  success: boolean;
  message: string;
  data: Expense[] | BackendExpenseResponse[]; // Can be either format
}

export interface ExpenseSummary {
  totalExpenses: number;
  totalByCategory: Record<ExpenseCategory, number>;
  memberBalances: Array<{
    userId: string;
    userName: string;
    paid: number;
    owed: number;
    balance: number;
  }>;
  settlements: Array<{
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    toUserName: string;
    amount: number;
  }>;
}

