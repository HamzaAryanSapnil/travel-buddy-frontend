"use server";

import { addStepSchema, completeSessionSchema, createSessionSchema, sendMessageSchema } from "@/zod/planner.validation";
import { createTravelPlan } from "@/lib/actions/travelPlan.action";
import { RedirectType, redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

export const sendMessage = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const message = formData.get("message") as string;
    const sessionId = formData.get("sessionId") as string | null;
    const answer = formData.get("answer") as string | null;
    const uiStep = formData.get("uiStep") as UIStep | null;

    // If no sessionId, create a new session
    if (!sessionId) {
      const planId = formData.get("planId") as string | null;
      const createPayload: Record<string, unknown> = {};
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

      const created = data.data;
      const id =
        (typeof created?.session?.id === "string" && created.session.id) ||
        (typeof created?.sessionId === "string" && created.sessionId) ||
        (typeof created?.id === "string" && created.id) ||
        "";

      if (!id) {
        return {
          success: false,
          message: "Failed to create planning session",
        };
      }

      const firstStepPayload = {
        sessionId: id,
        question: created?.question || message,
        answer: message,
        uiStep: "destination" as UIStep,
      };

      const firstValidation = zodValidator(firstStepPayload, addStepSchema);
      if (!firstValidation.success) {
        return firstValidation;
      }

      const stepResponse = await serverFetch.post(`/planner/${id}/step`, {
        body: JSON.stringify(firstValidation.data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const stepData = await stepResponse.json();
      console.log("Send message response from sendMessage.ts : ", stepData);

      if (!stepResponse.ok) {
        if (stepResponse.status === 401) {
          return {
            success: false,
            message: "Please log in to continue",
          };
        }

        if (stepResponse.status === 403) {
          return {
            success: false,
            message: "You don't have permission to continue",
          };
        }

        if (stepResponse.status === 404) {
          return {
            success: false,
            message: "Session not found",
          };
        }

        return {
          success: false,
          message: stepData.message || "Failed to add step",
        };
      }

      if (stepData.data?.finalOutput) {
        const finalOutput = stepData.data.finalOutput;
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
          message: stepData.message || "Plan generated successfully",
          data: {
            id,
            sessionId: id,
            session: { id },
            suggestion,
            response: stepData.data?.question || "Your travel plan is ready!",
            uiStep: stepData.data?.uiStep,
            remainingAIUses: stepData.data?.remainingAIUses,
          },
        };
      }

      return {
        success: true,
        message: stepData.message || "Step added",
        data: {
          id,
          sessionId: id,
          session: { id },
          question: stepData.data?.question,
          uiStep: stepData.data?.uiStep,
          remainingAIUses: stepData.data?.remainingAIUses,
          response: stepData.data?.question,
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
            sessionId,
            session: { id: sessionId },
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
          sessionId,
          session: { id: sessionId },
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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Send message error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to send message"
          : "Failed to send message. Please try again.",
    };
  }
};

export const saveGeneratedPlan = async (
  suggestion: PlanSuggestion,
  sessionId?: string
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    // Transform PlanSuggestion to FormData format expected by createTravelPlan
    const formData = new FormData();
    formData.append("title", suggestion.title);
    formData.append("destination", suggestion.destination);
    if (suggestion.origin) {
      formData.append("origin", suggestion.origin);
    }
    formData.append("startDate", suggestion.startDate);
    formData.append("endDate", suggestion.endDate);
    formData.append("travelType", suggestion.travelType);
    formData.append("budgetMin", suggestion.budgetMin.toString());
    if (suggestion.budgetMax) {
      formData.append("budgetMax", suggestion.budgetMax.toString());
    }
    formData.append("visibility", "PRIVATE"); // Default to private for AI-generated plans
    if (suggestion.description) {
      formData.append("description", suggestion.description);
    }

    // Call createTravelPlan service
    const result = await createTravelPlan(null, formData);

    if (result.success) {
      // If sessionId exists, complete the session
      if (sessionId) {
        await completeSession(sessionId, suggestion);
      }

      // Redirect to travel plans page (createTravelPlan already handles redirect)
      redirect("/dashboard/travel-plans", RedirectType.push);
    }

    console.log("Save generated plan data response from saveGeneratedPlan.ts : ", result);

    return result;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Save generated plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to save plan"
          : "Failed to save plan. Please try again.",
    };
  }
};

export async function getSession(
  sessionId: string
): Promise<{ success: boolean; data?: PlanningSession; message: string }> {
  try {
    const response = await serverFetch.get(`/planner/${sessionId}`, {
      next: {
        tags: [`planner-session-${sessionId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to view the session",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to view this session",
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
        message: data.message || "Failed to fetch session",
      };
    }
    console.log("Get session data response from getSession.ts : ", data);
    return {
      success: true,
      data: data.data,
      message: data.message || "Session fetched successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Get session error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to fetch session"
          : "Failed to fetch session. Please try again.",
    };
  }
}

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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Complete session error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to complete session"
          : "Failed to complete session. Please try again.",
    };
  }
};
