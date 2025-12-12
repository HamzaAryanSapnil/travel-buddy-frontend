/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";
import { revalidateTag } from "next/cache";
import { RedirectType, redirect } from "next/navigation";

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

    // Extract image URLs from FormData (uploaded to imgBB client-side)
    const coverPhoto = formData.get("coverPhoto")?.toString();
    const galleryImagesStr = formData.get("galleryImages");
    let galleryImages: string[] = [];

    if (galleryImagesStr) {
      if (typeof galleryImagesStr === "string") {
        try {
          galleryImages = JSON.parse(galleryImagesStr);
        } catch {
          // If not JSON, treat as single URL
          if (galleryImagesStr) {
            galleryImages = [galleryImagesStr];
          }
        }
      }
    }

    // Build JSON payload
    const jsonPayload: Record<string, any> = {
      ...validatedPayload,
    };

    // Add cover photo if provided
    if (coverPhoto && coverPhoto.trim()) {
      jsonPayload.coverPhoto = coverPhoto;
    }

    // Add gallery images if provided
    if (galleryImages && galleryImages.length > 0) {
      jsonPayload.galleryImages = galleryImages.filter((url) => url && url.trim());
    }

    // Send request to API with JSON
    const res = await serverFetch.post("/travel-plans", {
      body: JSON.stringify(jsonPayload),
      headers: {
        "Content-Type": "application/json",
      },
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

    // Success - redirect to plan details page (or list since details is a dialog now)
    if (result.success && result.data?.id) {
      // @ts-expect-error - revalidateTag signature mismatch in this environment
      revalidateTag("travel-plans");
      redirect("/dashboard/travel-plans", RedirectType.push);
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
