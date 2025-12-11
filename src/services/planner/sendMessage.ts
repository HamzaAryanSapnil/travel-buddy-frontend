/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import {
  sendMessageSchema,
  createSessionSchema,
  addStepSchema,
} from "@/zod/planner.validation";
import { PlanSuggestion, UIStep } from "@/types/planner.interface";

export const sendMessage = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const message = formData.get("message") as string;
    const sessionId = formData.get("sessionId") as string | null;
    const answer = formData.get("answer") as string | null;
    const uiStep = formData.get("uiStep") as UIStep | null;

    // If no sessionId, create a new session
    if (!sessionId) {
      const planId = formData.get("planId") as string | null;
      const createPayload: any = {};
      if (planId) {
        createPayload.planId = planId;
      }

      const validationResult = zodValidator(
        createPayload,
        createSessionSchema.partial()
      );
      if (!validationResult.success) {
        return validationResult;
      }

      // here we are creating a new session
      const response = await serverFetch.post("/planner", {
        body: JSON.stringify(createPayload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: "Please log in to use the AI planner",
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            message: "You don't have permission to use the AI planner",
          };
        }

        return {
          success: false,
          message: data.message || "Failed to create planning session",
        };
      }

      // Return the session with the first question
      // here we are returning the session with the first question
      return {
        success: true,
        message: data.message || "Session created",
        data: {
          id: data.data?.id,
          question: data.data?.question,
          uiStep: data.data?.uiStep,
          remainingAIUses: data.data?.remainingAIUses,
          response: data.data?.question,
        },
      };
    }

    // If sessionId exists, add a step
    // here we are adding a step to the session and returning the next question
    if (answer && uiStep) {
      const stepPayload = {
        sessionId,
        question: message || "", // The question from AI
        answer,
        uiStep,
      };

      const validationResult = zodValidator(stepPayload, addStepSchema);
      if (!validationResult.success) {
        return validationResult;
      }

      const response = await serverFetch.post(`/planner/${sessionId}/step`, {
        body: JSON.stringify(validationResult.data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      
      const data = await response.json();
      console.log("Send message response from sendMessage.ts : ", data);

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: "Please log in to continue",
          };
        }

        if (response.status === 403) {
          return {
            success: false,
            message: "You don't have permission to continue",
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
          message: data.message || "Failed to add step",
        };
      }

      // Check if we have a final output (plan suggestion)
      // here we are returning the plan suggestion
      if (data.data?.finalOutput) {
        const finalOutput = data.data.finalOutput;
        const suggestion: PlanSuggestion = {
          title: finalOutput.title,
          destination: finalOutput.destination,
          origin: finalOutput.origin,
          startDate: finalOutput.startDate,
          endDate: finalOutput.endDate,
          travelType: finalOutput.travelType,
          budgetMin: finalOutput.budgetMin,
          budgetMax: finalOutput.budgetMax,
          description: finalOutput.description,
          itinerary: finalOutput.itinerary,
          estimatedCost: finalOutput.estimatedCost,
        };

        return {
          success: true,
          message: data.message || "Plan generated successfully",
          data: {
            id: sessionId,
            suggestion,
            response: data.data?.question || "Your travel plan is ready!",
            uiStep: data.data?.uiStep,
            remainingAIUses: data.data?.remainingAIUses,
          },
        };
      }
      console.log("Send message data response from sendMessage.ts : ", data);
      // Return next question
      return {
        success: true,
        message: data.message || "Step added",
        data: {
          id: sessionId,
          question: data.data?.question,
          uiStep: data.data?.uiStep,
          remainingAIUses: data.data?.remainingAIUses,
          response: data.data?.question,
        },
      };
    }

    // Fallback: just validate message
    const validationResult = zodValidator(
      { message },
      sendMessageSchema.partial()
    );
    if (!validationResult.success) {
      return validationResult;
    }

    return {
      success: false,
      message:
        "Invalid request. Please provide sessionId with answer and uiStep, or create a new session.",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Send message error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to send message"
          : "Failed to send message. Please try again.",
    };
  }
};
