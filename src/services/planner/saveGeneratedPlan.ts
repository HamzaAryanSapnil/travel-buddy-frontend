/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createTravelPlan } from "@/services/travelPlans/createTravelPlan";
import { PlanSuggestion } from "@/types/planner.interface";
import { RedirectType, redirect } from "next/navigation";

export const saveGeneratedPlan = async (
  suggestion: PlanSuggestion,
  sessionId?: string
): Promise<any> => {
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
        const { completeSession } = await import("./completeSession");
        await completeSession(sessionId, suggestion);
      }

      // Redirect to travel plans page (createTravelPlan already handles redirect)
      redirect("/dashboard/travel-plans", RedirectType.push);
    }

    console.log("Save generated plan data response from saveGeneratedPlan.ts : ", result);

    return result;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Save generated plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to save plan"
          : "Failed to save plan. Please try again.",
    };
  }
};

