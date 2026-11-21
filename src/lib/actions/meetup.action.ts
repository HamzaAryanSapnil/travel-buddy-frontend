"use server";

import { createMeetupSchema, rsvpSchema, updateMeetupSchema } from "@/zod/meetup.validation";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

export async function getMeetups(
  filters: GetMeetupsFilters = {}
): Promise<{ data: Meetup[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (filters.planId) params.set("planId", filters.planId);
    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/meetups?${queryString}` : "/meetups";

    // Determine cache tag based on filters
    const cacheTag = filters.planId
      ? `plan-meetups-${filters.planId}`
      : "meetups-list";

    const response = await serverFetch.get(endpoint, {
      next: {
        tags: [cacheTag],
      },
    });

    // Handle 401/403 - user not authenticated or no access (graceful degradation)
    if (response.status === 401 || response.status === 403) {
      return { data: [], error: null };
    }

    // Handle 404 - no meetups found
    if (response.status === 404) {
      return { data: [], error: null };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch meetups");
    }

    const result = await response.json();

    // Backend returns array directly or wrapped in { data: [...] }
    const meetups: Meetup[] = Array.isArray(result)
      ? result
      : result.data || [];

    return { data: meetups, error: null };
  } catch (error: unknown) {
    console.error("Get meetups error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}

export async function updateMeetupStatus(
  planId: string,
  meetupId: string,
  status: MeetupStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(`/meetups/${meetupId}`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Please log in to update meetup status" };
      }
      if (response.status === 403) {
        return { success: false, message: "You don't have permission to update this meetup" };
      }
      if (response.status === 404) {
        return { success: false, message: "Meetup not found" };
      }
      return {
        success: false,
        message: data.message || "Failed to update meetup status",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`plan-meetups-${planId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`meetup-${meetupId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("meetups-list");

    return {
      success: true,
      message: data.message || "Meetup status updated successfully",
    };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Update meetup status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to update meetup status"
          : "Failed to update meetup status. Please try again.",
    };
  }
}

// Helper function to convert date to ISO format
const convertDateToISO = (dateString: string | null | undefined) => {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  return date.toISOString();
};

export const updateMeetup = async (
  planId: string,
  meetupId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
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
    const validationResult = zodValidator(payload, updateMeetupSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // Send request to API
    const response = await serverFetch.patch(`/meetups/${meetupId}`, {
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
          message: "Please log in to update meetups",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update this meetup",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Meetup not found",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to update meetup",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to update meetup";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`plan-meetups-${planId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`meetup-${meetupId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("meetups-list");

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Meetup updated successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Update meetup error:", error);
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Failed to update meetup";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to update meetup. Please try again.",
    };
  }
};

export const rsvpMeetup = async (
  meetupId: string,
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("RSVP meetup error:", error);
    const errorMessage =
      error instanceof Error && error.message
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

export async function getPlanMeetups(
  planId: string
): Promise<{ data: Meetup[]; error: string | null }> {
  // Reuse getMeetups with planId filter
  return getMeetups({ planId });
}

export async function getMeetup(
  meetupId: string
): Promise<{ data?: Meetup; error: string | null }> {
  try {
    const response = await serverFetch.get(`/meetups/${meetupId}`, {
      next: {
        tags: [`meetup-${meetupId}`],
      },
    });

    // Handle 401 - user not authenticated
    if (response.status === 401) {
      return {
        data: undefined,
        error: "Please log in to view this meetup",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        data: undefined,
        error: "You don't have permission to view this meetup",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        data: undefined,
        error: "Meetup not found",
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch meetup");
    }

    const result = await response.json();

    // Backend returns object directly or wrapped in { data: {...} }
    const meetup: Meetup = result.data || result;

    return { data: meetup, error: null };
  } catch (error: unknown) {
    console.error("Get meetup error:", error);
    return {
      data: undefined,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to fetch meetup"
          : "Failed to fetch meetup. Please try again.",
    };
  }
}

export async function deleteMeetup(
  planId: string,
  meetupId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/meetups/${meetupId}`);

    // Handle 401 - redirect to login (if needed, can add redirect import)
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete this meetup",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this meetup",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Meetup not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete meetup");
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`plan-meetups-${planId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`meetup-${meetupId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("meetups-list");

    return {
      success: true,
      message: data.message || "Meetup deleted successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Delete meetup error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to delete meetup"
          : "Failed to delete meetup. Please try again.",
    };
  }
}

export const createMeetup = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Create meetup error:", error);
    const errorMessage =
      error instanceof Error && error.message
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
