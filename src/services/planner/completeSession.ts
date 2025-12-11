/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { completeSessionSchema } from "@/zod/planner.validation";
import { PlanSuggestion } from "@/types/planner.interface";

export const completeSession = async (
  sessionId: string,
  finalOutput: PlanSuggestion
): Promise<{ success: boolean; message: string; planId?: string }> => {
  try {
    const payload = {
      sessionId,
      finalOutput: {
        title: finalOutput.title,
        destination: finalOutput.destination,
        origin: finalOutput.origin,
        startDate: finalOutput.startDate,
        endDate: finalOutput.endDate,
        travelType: finalOutput.travelType,
        budgetMin: finalOutput.budgetMin,
        budgetMax: finalOutput.budgetMax,
        description: finalOutput.description,
        estimatedCost: finalOutput.estimatedCost,
      },
    };

    const validationResult = zodValidator(payload, completeSessionSchema);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.errors && validationResult.errors.length > 0
          ? validationResult.errors.map((e) => e.message).join(", ")
          : "Invalid plan data";
      return {
        success: false,
        message: errorMessage,
      };
    }

    const response = await serverFetch.post(`/planner/${sessionId}/complete`, {
      body: JSON.stringify(validationResult.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to complete the session",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to complete this session",
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          message: "Session not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to complete session",
      };
    }
   console.log("Complete session data response from completeSession.ts : ", data);
    return {
      success: true,
      message: data.message || "Session completed successfully",
      planId: data.data?.planId,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Complete session error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to complete session"
          : "Failed to complete session. Please try again.",
    };
  }
};

