/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { Expense, BackendExpenseResponse } from "@/types/expense.interface";

interface GetExpensesFilters {
  category?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Transform backend expense response to our Expense interface
 */
function transformBackendExpense(
  backendExpense: BackendExpenseResponse
): Expense {
  // Convert participants to splits format
  const splits =
    backendExpense.participants?.map((participant) => ({
      userId: participant.userId,
      amount: participant.amount,
    })) || [];

  // Use description as title if title doesn't exist (backend doesn't have title)
  const title = backendExpense.description || "Untitled Expense";

  return {
    id: backendExpense.id,
    planId: backendExpense.planId,
    title: title,
    description: backendExpense.description || null,
    amount: backendExpense.amount,
    category: backendExpense.category,
    paidBy: backendExpense.payerId, // Transform payerId to paidBy
    splitType: backendExpense.splitType,
    splits: splits, // Transform participants to splits
    expenseDate: backendExpense.expenseDate || null,
    createdAt: backendExpense.createdAt,
    updatedAt: backendExpense.updatedAt,
    // Relations
    paidByUser: backendExpense.payer || undefined, // Transform payer to paidByUser
    splitsWithUsers:
      backendExpense.participants?.map((participant) => ({
        userId: participant.userId,
        amount: participant.amount,
        user: participant.user || {
          id: participant.userId,
          name: "",
          email: "",
          role: "USER" as any,
        },
      })) || undefined,
  };
}

export async function getExpenses(
  planId: string,
  filters: GetExpensesFilters = {}
): Promise<{ data: Expense[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set("planId", planId);
    if (filters.category) params.set("category", filters.category);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    const queryString = params.toString();
    const response = await serverFetch.get(`/expenses?${queryString}`, {
      next: {
        tags: [`trip-expenses-${planId}`],
      },
    });

    // Handle 401/403 - user not authenticated or no access (graceful degradation)
    if (response.status === 401 || response.status === 403) {
      return { data: [], error: null };
    }

    // Handle 404 - no expenses found
    if (response.status === 404) {
      return { data: [], error: null };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const result = await response.json();

    // Backend returns array directly, not wrapped in { data: [...] }
    const backendExpenses: BackendExpenseResponse[] = Array.isArray(result)
      ? result
      : result.data || [];

    // Transform backend expenses to our Expense format
    const expenses: Expense[] = backendExpenses.map(transformBackendExpense);

    return { data: expenses, error: null };
  } catch (error: any) {
    console.error("Get expenses error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}
