/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function deleteExpense(
  planId: string,
  expenseId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/expenses/${expenseId}`);

    // Handle 401 - redirect to login (if needed, can add redirect import)
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete this expense",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this expense",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Expense not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete expense");
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-expenses-${planId}`);

    return {
      success: true,
      message: data.message || "Expense deleted successfully",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Delete expense error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to delete expense"
          : "Failed to delete expense. Please try again.",
    };
  }
}

