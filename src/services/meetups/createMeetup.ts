/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createMeetupSchema } from "@/zod/meetup.validation";
import { revalidateTag } from "next/cache";

// Helper function to convert date to ISO format
const convertDateToISO = (dateString: string | null | undefined) => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return date.toISOString();
};

export const createMeetup = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload: any = {
      planId,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      location: formData.get("location"),
      scheduledAt: convertDateToISO(formData.get("scheduledAt") as string),
      endAt: convertDateToISO(formData.get("endAt") as string),
      videoRoomLink: formData.get("videoRoomLink") || undefined,
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // Validate using Zod
    const validationResult = zodValidator(payload, createMeetupSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // Send request to API
    const response = await serverFetch.post(`/meetups`, {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to create meetups",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to create meetups for this plan",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Travel plan not found",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to create meetup",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to create meetup";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`plan-meetups-${planId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("meetups-list");

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Meetup created successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Create meetup error:", error);
    const errorMessage =
      error?.message && typeof error.message === "string"
        ? error.message
        : "Failed to create meetup";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to create meetup. Please try again.",
    };
  }
};
