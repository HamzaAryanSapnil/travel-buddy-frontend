/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";
import { revalidateTag } from "next/cache";

export const updateAdminTravelPlan = async (
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
    const jsonPayload: Record<string, any> = {};
    if (typeof validatedPayload === "object" && validatedPayload !== null) {
      Object.assign(jsonPayload, validatedPayload);
    }

    // Add cover photo if provided
    if (coverPhoto && coverPhoto.trim()) {
      jsonPayload.coverPhoto = coverPhoto;
    }

    // Add gallery images if provided
    if (galleryImages && galleryImages.length > 0) {
      jsonPayload.galleryImages = galleryImages.filter((url) => url && url.trim());
    }

    const res = await serverFetch.patch(`/travel-plans/admin/${planId}`, {
      body: JSON.stringify(jsonPayload),
      headers: {
        "Content-Type": "application/json",
      },
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

    // Revalidate both admin and regular travel plans cache
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`travel-plan-${planId}`);

    return {
      success: true,
      message: result.message || "Travel plan updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Update admin travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update travel plan. Please try again.",
    };
  }
};

