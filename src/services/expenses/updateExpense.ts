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
        const splits = JSON.parse(splitsStr);
        // Backend expects 'participants' not 'splits' for CUSTOM split
        // For CUSTOM split, ensure only userId and amount (no percentage)
        if (payload.splitType === "CUSTOM" && Array.isArray(splits)) {
          payload.participants = splits.map((split: any) => ({
            userId: split.userId,
            amount: parseFloat(split.amount) || 0,
            // Explicitly exclude percentage field for CUSTOM split
          }));
        } else if (payload.splitType === "EQUAL" && Array.isArray(splits)) {
          // For EQUAL split, also use participants
          payload.participants = splits.map((split: any) => ({
            userId: split.userId,
            amount: parseFloat(split.amount) || 0,
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
      const totalAmount = parseFloat(payload.amount) || 0;
      const sum = payload.participants.reduce((acc: number, p: any) => acc + (parseFloat(p.amount) || 0), 0);
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
      const hasPercentage = payload.participants.some((p: any) => p.percentage !== undefined);
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
    if (validatedPayload.participants && Array.isArray(validatedPayload.participants)) {
      (validatedPayload as any).participants = validatedPayload.participants.map((p: any) => ({
        userId: p.userId,
        amount: parseFloat(p.amount) || 0,
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

