/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { rsvpSchema } from "@/zod/meetup.validation";
import { revalidateTag } from "next/cache";

export const rsvpMeetup = async (
  meetupId: string,
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const payload: any = {
      meetupId,
      status: formData.get("status"),
    };

    // Validate using Zod
    const validationResult = zodValidator(payload, rsvpSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;
    if (!validatedPayload) {
      return {
        success: false,
        message: "Validation failed",
      };
    }

    // Send request to API
    const response = await serverFetch.post(`/meetups/${meetupId}/rsvp`, {
      body: JSON.stringify({ status: validatedPayload.status }),
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
          message: "Please log in to RSVP to meetups",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to RSVP to this meetup",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Meetup not found",
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to RSVP to meetup";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`meetup-${meetupId}`);
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
        : "RSVP updated successfully";

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

    console.error("RSVP meetup error:", error);
    const errorMessage =
      error?.message && typeof error.message === "string"
        ? error.message
        : "Failed to RSVP to meetup";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to RSVP to meetup. Please try again.",
    };
  }
};

