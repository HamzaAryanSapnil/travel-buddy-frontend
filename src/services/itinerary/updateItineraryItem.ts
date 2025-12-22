/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateItineraryItemSchema } from "@/zod/itinerary.validation";
import { revalidateTag } from "next/cache";
import { convertToISO, getDateForDayIndex } from "@/utils/itinerary.helpers";

export const updateItineraryItem = async (
  planId: string,
  itemId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const planResponse = await serverFetch.get(`/travel-plans/${planId}`);
    if (!planResponse.ok) {
      return {
        success: false,
        message: "Failed to fetch plan details",
      };
    }

    const planData = await planResponse.json();
    const plan = planData?.data;
    const dayIndex = formData.get("dayIndex")
      ? Number(formData.get("dayIndex"))
      : undefined;
    // Calculate the actual date for this dayIndex (if provided)
    let dayDate: Date | undefined;
    if (dayIndex) {
      const planStartDate = new Date(plan.startDate);
      dayDate = getDateForDayIndex(planStartDate, dayIndex);
    }

    const payload: any = {
      dayIndex: dayIndex || undefined,
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      startAt: convertToISO(formData.get("startAt") as string, dayDate!), // Pass dayDate
      endAt: convertToISO(formData.get("endAt") as string, dayDate!), // Pass dayDate
      locationId: formData.get("locationId") || undefined,
      order: formData.get("order") || undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // Validate using Zod
    const validationResult = zodValidator(payload, updateItineraryItemSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // Send request to API
    const response = await serverFetch.patch(`/itinerary/${itemId}`, {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to update itinerary item";

      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: errorMessage,
          errors: data.errors,
        };
      }

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-itinerary-${planId}`);

    // Ensure message is always a string
    const successMessage =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Itinerary item updated successfully";

    return {
      success: true,
      message: successMessage,
      data: data.data,
    };
  } catch (error: any) {
    console.error("Update itinerary item error:", error);
    // Ensure error message is always a string
    const errorMessage =
      error?.message && typeof error.message === "string"
        ? error.message
        : "Failed to update itinerary item";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to update itinerary item",
    };
  }
};
