/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createItineraryItemSchema } from "@/zod/itinerary.validation";
import { revalidateTag } from "next/cache";

// Helper function to convert datetime-local to ISO format
// datetime-local format: "2025-01-15T09:00" (local time, no timezone)
// We need to treat it as local time and convert to UTC correctly
const convertToISO = (datetimeLocal: string | null | undefined) => {
  if (!datetimeLocal || datetimeLocal.trim() === "") return undefined;
  
  try {
    // datetime-local is already in local timezone
    // JavaScript's Date constructor will interpret it correctly as local time
    // and toISOString() will convert it to UTC
    const date = new Date(datetimeLocal);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return undefined;
    }
    
    return date.toISOString();
  } catch (error) {
    return undefined;
  }
};

export const createItineraryItem = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload: any = {
      planId,
      dayIndex: formData.get("dayIndex"),
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      startAt: convertToISO(formData.get("startAt") as string), // Convert to ISO
      endAt: convertToISO(formData.get("endAt") as string), // Convert to ISO
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
    const validationResult = zodValidator(payload, createItineraryItemSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;
    // Send request to API
    const response = await serverFetch.post(`/itinerary`, {
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
          : "Failed to create itinerary item";

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
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Itinerary item created successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: any) {
    console.error("Create itinerary item error:", error);
    // Ensure error message is always a string
    const errorMessage =
      error?.message && typeof error.message === "string"
        ? error.message
        : "Failed to create itinerary item";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to create itinerary item",
    };
  }
};
