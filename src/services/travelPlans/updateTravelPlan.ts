"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateTravelPlan = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload: any = {
      title: formData.get("title"),
      destination: formData.get("destination"),
      origin: formData.get("origin") || undefined,
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      travelType: formData.get("travelType"),
      budgetMin: formData.get("budgetMin")
        ? parseFloat(formData.get("budgetMin") as string)
        : undefined,
      budgetMax: formData.get("budgetMax")
        ? parseFloat(formData.get("budgetMax") as string)
        : undefined,
      visibility: formData.get("visibility"),
      description: formData.get("description") || undefined,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    const validationResult = zodValidator(
      payload,
      createTravelPlanValidationSchema
    );

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    const outgoing = new FormData();
    if (typeof validatedPayload === "object" && validatedPayload !== null) {
      Object.entries(validatedPayload).forEach(([key, value]) => {
        outgoing.append(key, String(value));
      });
    }

    const files = formData.getAll("files") as (File | string)[];
    files.forEach((file) => {
      if (file instanceof File) {
        outgoing.append("files", file);
      }
    });

    const res = await serverFetch.patch(`/travel-plans/${planId}`, {
      body: outgoing,
      // let fetch set multipart boundary
    });

    const result = await res.json();

    if (!res.ok) {
      if (result.errors && Array.isArray(result.errors)) {
        return {
          success: false,
          message: result.message || "Failed to update travel plan",
          errors: result.errors,
        };
      }
      return {
        success: false,
        message:
          result.message ||
          "Failed to update travel plan. Please check your inputs.",
      };
    }

    return {
      success: true,
      message: result.message || "Travel plan updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Update travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update travel plan. Please try again.",
    };
  }
};

