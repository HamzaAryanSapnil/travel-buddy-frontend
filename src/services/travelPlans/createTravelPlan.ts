/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";
import { redirect } from "next/navigation";

export const createTravelPlan = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Extract form data
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

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // Validate using Zod schema (only non-file fields)
    const validationResult = zodValidator(
      payload,
      createTravelPlanValidationSchema
    );

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload: Record<string, any> = validationResult.data || {};

    // Build outgoing multipart FormData (backend supports files[]; first = cover photo)
    const outgoing = new FormData();
    Object.entries(validatedPayload).forEach(([key, value]) => {
      outgoing.append(key, String(value));
    });

    const files = formData.getAll("files") as (File | string)[];
    files.forEach((file) => {
      if (file instanceof File) {
        outgoing.append("files", file);
      }
    });

    // Send request to API
    const res = await serverFetch.post("/travel-plans", {
      body: outgoing,
      // No explicit Content-Type; fetch will set multipart boundary
    });

    const result = await res.json();

    // Handle API errors
    if (!res.ok) {
      // Parse error messages from API
      if (result.errors && Array.isArray(result.errors)) {
        return {
          success: false,
          message: result.message || "Failed to create travel plan",
          errors: result.errors,
        };
      }

      // Handle field-specific errors
      if (result.message) {
        // Try to extract field from message
        const fieldErrors: Array<{ field: string; message: string }> = [];

        // Common error patterns
        if (result.message.includes("startDate")) {
          fieldErrors.push({
            field: "startDate",
            message: result.message,
          });
        }
        if (result.message.includes("endDate")) {
          fieldErrors.push({
            field: "endDate",
            message: result.message,
          });
        }
        if (result.message.includes("travelType")) {
          fieldErrors.push({
            field: "travelType",
            message: result.message,
          });
        }

        if (fieldErrors.length > 0) {
          return {
            success: false,
            message: result.message,
            errors: fieldErrors,
          };
        }

        return {
          success: false,
          message: result.message,
        };
      }

      return {
        success: false,
        message: "Failed to create travel plan. Please try again.",
      };
    }

    // Success - redirect to plan details page
    if (result.success && result.data?.id) {
      redirect(`/dashboard/travel-plans/${result.data.id}`);
    }

    return {
      success: false,
      message: "Travel plan created but no ID returned",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Create travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create travel plan. Please try again.",
    };
  }
};

