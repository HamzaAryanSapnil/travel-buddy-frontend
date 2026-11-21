"use server";

import { convertToISO, getDateForDayIndex } from "@/utils/itinerary.helpers";
import { createItineraryItemSchema, updateItineraryItemSchema } from "@/zod/itinerary.validation";
import { getCookie } from "@/lib/actions/auth.action";
import { publicFetch } from "@/lib/public-fetch";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

/**
 * Get itinerary for a travel plan
 * Public for PUBLIC plans, authenticated for PRIVATE/UNLISTED
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getItinerary(
  planId: string
): Promise<{ data: PublicItineraryDay[] | null; error: string | null }> {
  try {
    const accessToken = await getCookie("accessToken");

    const fetchOptions = {
      next: {
        tags: ["travel-itinerary", `travel-plan-${planId}`],
        revalidate: 259200,
      },
    };

    // Try public fetch first, authenticated if logged in
    const response = accessToken
      ? await serverFetch.get(`/itinerary/${planId}`, fetchOptions)
      : await publicFetch.get(`/itinerary/${planId}`, fetchOptions);

    // Handle 401 - plan is private
    if (response.status === 401) {
      return {
        data: null,
        error: "Please log in to view this itinerary",
      };
    }

    if (response.status === 404) {
      return {
        data: [],
        error: null,
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch itinerary");
    }

    const result: PublicItineraryResponse = await response.json();
    return {
      data: result.data.days,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Get itinerary error:", error);
    return {
      data: null,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to fetch itinerary. Please try again.",
    };
  }
}

export const updateItineraryItem = async (
  planId: string,
  itemId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
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

    const payload: Record<string, unknown> = {
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
  } catch (error: unknown) {
    console.error("Update itinerary item error:", error);
    // Ensure error message is always a string
    const errorMessage =
      error instanceof Error && error.message
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

export async function reorderItineraryItems(
  planId: string,
  updates: Array<{ id: string; dayIndex: number; order: number }>
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(`/itinerary/reorder`, {
      body: JSON.stringify({ planId, updates }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to reorder items",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-itinerary-${planId}`);

    return {
      success: true,
      message: data.message || "Items reordered successfully",
    };
  } catch (error: unknown) {
    console.error("Reorder itinerary items error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to reorder items",
    };
  }
}

export async function getItineraryItems(
  planId: string
): Promise<ItineraryDaysResponse> {
  try {
    const response = await serverFetch.get(`/itinerary/${planId}`, {
      next: {
        tags: [`trip-itinerary-${planId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch itinerary items",
        data: {
          days: [],
          totalDays: 0,
        },
      };
    }

    

    return data;
  } catch (error: unknown) {
    console.error("Get itinerary items error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to fetch itinerary items",
      data: {
        days: [],
        totalDays: 0,
      },
    };
  }
}

export async function deleteItineraryItem(
  planId: string,
  itemId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/itinerary/${itemId}`);

    // Handle 401 - redirect to login (if needed, can add redirect import)
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete this item",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this item",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Itinerary item not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete itinerary item");
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-itinerary-${planId}`);

    return {
      success: true,
      message: data.message || "Itinerary item deleted successfully",
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

    console.error("Delete itinerary item error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to delete itinerary item"
          : "Failed to delete itinerary item. Please try again.",
    };
  }
}

export const createItineraryItem = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const planResponse = await serverFetch.get(`/travel-plans/${planId}`);
    if (!planResponse.ok) {
      return {
        success: false,
        message: "Failed to fetch plan details",
      };
    }

    const planData = await planResponse.json();
    const plan = planData.data;

    const dayIndex = Number(formData.get("dayIndex"));

    // Calculate the actual date for this dayIndex
    const planStartDate = new Date(plan?.startDate);
    const dayDate = getDateForDayIndex(planStartDate, dayIndex);

    const payload: Record<string, unknown> = {
      planId,
      dayIndex: dayIndex,
      title: formData.get("title"),
      description: formData.get("description") || undefined,
      startAt: convertToISO(formData.get("startAt") as string, dayDate), // Pass dayDate
      endAt: convertToISO(formData.get("endAt") as string, dayDate), // Pass dayDate
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
  } catch (error: unknown) {
    console.error("Create itinerary item error:", error);
    // Ensure error message is always a string
    const errorMessage =
      error instanceof Error && error.message
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
