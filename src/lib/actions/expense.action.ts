"use server";

import { createExpenseSchema, updateExpenseSchema } from "@/zod/expense.validation";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

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
          role: "USER",
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
  } catch (error: unknown) {
    console.error("Get expenses error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}

// Helper function to convert date to ISO format
const convertDateToISO = (dateString: string | null | undefined) => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return date.toISOString();
};

export const updateExpense = async (
  planId: string,
  expenseId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      amount: formData.get("amount"),
      category: formData.get("category"),
      payerId: formData.get("paidBy"), // Backend expects payerId, form sends paidBy
      splitType: formData.get("splitType"),
      expenseDate: convertDateToISO(formData.get("expenseDate") as string),
    };

    // Parse splits if provided
    const splitsStr = formData.get("splits");
    if (splitsStr && typeof splitsStr === "string") {
      try {
        const splits = JSON.parse(splitsStr);
        // Backend expects 'participants' not 'splits' for CUSTOM split
        // For CUSTOM split, ensure only userId and amount (no percentage)
        if (payload.splitType === "CUSTOM" && Array.isArray(splits)) {
          payload.participants = splits.map((split: { userId: string; amount: string | number }) => ({
            userId: split.userId,
            amount: parseFloat(String(split.amount)) || 0,
            // Explicitly exclude percentage field for CUSTOM split
          }));
        } else if (payload.splitType === "EQUAL" && Array.isArray(splits)) {
          // For EQUAL split, also use participants
          payload.participants = splits.map((split: { userId: string; amount: string | number }) => ({
            userId: split.userId,
            amount: parseFloat(String(split.amount)) || 0,
          }));
        }
      } catch {
        return {
          success: false,
          message: "Invalid splits format",
          errors: [
            {
              field: "splits",
              message: "Invalid splits format",
            },
          ],
        };
      }
    }

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // For CUSTOM split, validate participants array and sum
    if (payload.splitType === "CUSTOM") {
      if (!payload.participants || !Array.isArray(payload.participants) || payload.participants.length === 0) {
        return {
          success: false,
          message: "For CUSTOM split, participants array is required",
          errors: [
            {
              field: "participants",
              message: "Participants array is required for CUSTOM split",
            },
          ],
        };
      }

      // Validate sum equals total amount
      const totalAmount = parseFloat(String(payload.amount)) || 0;
      const sum = payload.participants.reduce((acc: number, p: { amount: string | number }) => acc + (parseFloat(String(p.amount)) || 0), 0);
      if (Math.abs(sum - totalAmount) > 0.01) {
        return {
          success: false,
          message: `Sum of participant amounts (${sum}) must equal total amount (${totalAmount})`,
          errors: [
            {
              field: "participants",
              message: `Sum of participant amounts (${sum}) must equal total amount (${totalAmount})`,
            },
          ],
        };
      }

      // Ensure no percentage field exists
      const hasPercentage = payload.participants.some((p: { percentage?: unknown }) => p.percentage !== undefined);
      if (hasPercentage) {
        return {
          success: false,
          message: "For CUSTOM split, provide amount only. Don't include percentage.",
          errors: [
            {
              field: "participants",
              message: "For CUSTOM split, provide amount only. Don't include percentage.",
            },
          ],
        };
      }
    }

    // Validate using Zod (for other fields)
    const validationResult = zodValidator(payload, updateExpenseSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;
    
    if (!validatedPayload || typeof validatedPayload !== "object") {
      return {
        success: false,
        message: "Invalid expense data",
      };
    }
    
    // Ensure participants are properly formatted for backend
    const payloadRecord = validatedPayload as Record<string, unknown>;
    if (Array.isArray(payloadRecord.participants)) {
      payloadRecord.participants = (
        payloadRecord.participants as { userId: string; amount: string | number }[]
      ).map((p) => ({
        userId: p.userId,
        amount: parseFloat(String(p.amount)) || 0,
      }));
    }

    // Send request to API
    const response = await serverFetch.patch(`/expenses/${expenseId}`, {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update expenses",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update this expense",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Expense not found",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to update expense",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to update expense";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-expenses-${planId}`);

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Expense updated successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Update expense error:", error);
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Failed to update expense";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to update expense. Please try again.",
    };
  }
};

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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Delete expense error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to delete expense"
          : "Failed to delete expense. Please try again.",
    };
  }
}

export const createExpense = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
      planId,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      amount: formData.get("amount"),
      category: formData.get("category"),
      payerId: formData.get("paidBy"), // Backend expects payerId, form sends paidBy
      splitType: formData.get("splitType"),
      expenseDate: convertDateToISO(formData.get("expenseDate") as string),
    };

    // Parse splits if provided
    const splitsStr = formData.get("splits");
    if (splitsStr && typeof splitsStr === "string") {
      try {
        const splits = JSON.parse(splitsStr);
        // Backend expects 'participants' not 'splits' for CUSTOM split
        // For CUSTOM split, ensure only userId and amount (no percentage)
        if (payload.splitType === "CUSTOM" && Array.isArray(splits)) {
          payload.participants = splits.map((split: { userId: string; amount: string | number }) => ({
            userId: split.userId,
            amount: parseFloat(String(split.amount)) || 0,
            // Explicitly exclude percentage field for CUSTOM split
          }));
        } else if (payload.splitType === "EQUAL" && Array.isArray(splits)) {
          // For EQUAL split, also use participants
          payload.participants = splits.map((split: { userId: string; amount: string | number }) => ({
            userId: split.userId,
            amount: parseFloat(String(split.amount)) || 0,
          }));
        }
      } catch {
        return {
          success: false,
          message: "Invalid splits format",
          errors: [
            {
              field: "splits",
              message: "Invalid splits format",
            },
          ],
        };
      }
    }

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // For CUSTOM split, validate participants array and sum
    if (payload.splitType === "CUSTOM") {
      if (!payload.participants || !Array.isArray(payload.participants) || payload.participants.length === 0) {
        return {
          success: false,
          message: "For CUSTOM split, participants array is required",
          errors: [
            {
              field: "participants",
              message: "Participants array is required for CUSTOM split",
            },
          ],
        };
      }

      // Validate sum equals total amount
      const totalAmount = parseFloat(String(payload.amount)) || 0;
      const sum = payload.participants.reduce((acc: number, p: { amount: string | number }) => acc + (parseFloat(String(p.amount)) || 0), 0);
      if (Math.abs(sum - totalAmount) > 0.01) {
        return {
          success: false,
          message: `Sum of participant amounts (${sum}) must equal total amount (${totalAmount})`,
          errors: [
            {
              field: "participants",
              message: `Sum of participant amounts (${sum}) must equal total amount (${totalAmount})`,
            },
          ],
        };
      }

      // Ensure no percentage field exists
      const hasPercentage = payload.participants.some((p: { percentage?: unknown }) => p.percentage !== undefined);
      if (hasPercentage) {
        return {
          success: false,
          message: "For CUSTOM split, provide amount only. Don't include percentage.",
          errors: [
            {
              field: "participants",
              message: "For CUSTOM split, provide amount only. Don't include percentage.",
            },
          ],
        };
      }
    }

    // Validate using Zod (for other fields)
    const validationResult = zodValidator(payload, createExpenseSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;
    
    if (!validatedPayload || typeof validatedPayload !== "object") {
      return {
        success: false,
        message: "Invalid expense data",
      };
    }
    
    // Ensure participants are properly formatted for backend
    const payloadRecord = validatedPayload as Record<string, unknown>;
    if (Array.isArray(payloadRecord.participants)) {
      payloadRecord.participants = (
        payloadRecord.participants as { userId: string; amount: string | number }[]
      ).map((p) => ({
        userId: p.userId,
        amount: parseFloat(String(p.amount)) || 0,
      }));
    }

    // Send request to API
    const response = await serverFetch.post(`/expenses`, {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to create expenses",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to create expenses for this plan",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Travel plan not found",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to create expense",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to create expense";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-expenses-${planId}`);

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Expense created successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Create expense error:", error);
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Failed to create expense";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to create expense. Please try again.",
    };
  }
};
