/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateExpenseSchema } from "@/zod/expense.validation";
import { revalidateTag } from "next/cache";

// Helper function to convert date to ISO format
const convertDateToISO = (dateString: string | null | undefined) => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return date.toISOString();
};

export const updateExpense = async (
  planId: string,
  expenseId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload: any = {
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
        payload.splits = JSON.parse(splitsStr);
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

    // Validate using Zod
    const validationResult = zodValidator(payload, updateExpenseSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Update expense error:", error);
    const errorMessage =
      error?.message && typeof error.message === "string"
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

