"use server";

import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";
import { getCookie } from "@/lib/actions/auth.action";
import { publicFetch } from "@/lib/public-fetch";
import { RedirectType, redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

/**
 * Get single travel plan by ID
 * Uses public fetch for PUBLIC plans, authenticated fetch for PRIVATE/UNLISTED
 * Returns error codes: 401 (auth required), 403 (no access), 404 (not found)
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getTravelPlan(
  planId: string
): Promise<{
  data: TravelPlanDetail | null;
  error: string | null;
  statusCode?: number;
}> {
  try {
    const accessToken = await getCookie("accessToken");

    const fetchOptions = {
      next: {
        tags: ["travel-plans", `travel-plan-${planId}`],
        revalidate: 259200,
      },
    };

    // Try public fetch first
    const response = accessToken
      ? await serverFetch.get(`/travel-plans/${planId}`, fetchOptions)
      : await publicFetch.get(`/travel-plans/${planId}`, fetchOptions);

    // Handle specific status codes
    if (response.status === 401) {
      return {
        data: null,
        error: "Please log in to view this plan",
        statusCode: 401,
      };
    }

    if (response.status === 403) {
      return {
        data: null,
        error: "You don't have permission to view this plan",
        statusCode: 403,
      };
    }

    if (response.status === 404) {
      return {
        data: null,
        error: "Travel plan not found",
        statusCode: 404,
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch travel plan");
    }

    const result: TravelPlanResponse = await response.json();
    return {
      data: result.data,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Get travel plan error:", error);
    return {
      data: null,
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to fetch travel plan. Please try again.",
      statusCode: 500,
    };
  }
}

export const updateTravelPlan = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    const payload: Record<string, unknown> = {
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
    const jsonPayload: Record<string, unknown> = {};
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

    const res = await serverFetch.patch(`/travel-plans/${planId}`, {
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

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`travel-plan-${planId}`);

    return {
      success: true,
      message: result.message || "Travel plan updated successfully",
      data: result.data,
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
    console.error("Update travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to update travel plan. Please try again.",
    };
  }
};

export async function getTravelPlans(
  filters: TravelPlansFilters = {}
): Promise<TravelPlansResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.travelType) params.set("travelType", filters.travelType);
    if (filters.visibility) params.set("visibility", filters.visibility);
    if (filters.isFeatured !== undefined)
      params.set("isFeatured", filters.isFeatured.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    // Note: type filter (future/past) is handled client-side after fetch
    // API doesn't support type parameter directly
    // When type filter is active, fetch more items to ensure proper filtering
    if (filters.type) {
      // Increase limit significantly when filtering by type to get all matching results
      // Then we'll filter and paginate client-side
      params.set("limit", "1000"); // Fetch up to 1000 items for filtering
    }

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/travel-plans${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["travel-plans"],
        },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      throw new Error("You don't have permission to view these plans");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No travel plans found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch travel plans");
    }

    const data = await response.json();

    // Filter by type (future/past) client-side if specified
    if (filters.type && data.success && data.data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredData = data.data.filter((plan: TravelPlan) => {
        const startDate = new Date(plan.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(plan.endDate);
        endDate.setHours(0, 0, 0, 0);

        if (filters.type === "future") {
          return startDate >= today;
        } else if (filters.type === "past") {
          return endDate < today;
        }
        return true;
      });

      // Recalculate pagination meta after filtering
      const total = filteredData.length;
      const limit = filters.limit || 12;
      const page = filters.page || 1;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        ...data,
        data: paginatedData,
        meta: {
          ...data.meta,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Get travel plans error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
        : "Failed to fetch travel plans. Please try again."
    );
  }
}

/**
 * Get public travel plans (no authentication required)
 * Uses /api/v1/travel-plans/public endpoint
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getPublicTravelPlans(
  filters: TravelPlansFilters = {}
): Promise<TravelPlansResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.travelType) params.set("travelType", filters.travelType);
    if (filters.isFeatured !== undefined)
      params.set("isFeatured", filters.isFeatured.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await publicFetch.get(
      `/travel-plans/public${queryString ? `?${queryString}` : ""}`,
      {
        next: {
          tags: ["travel-plans"],
          revalidate: 259200, // Fallback: revalidate every 72 hours (3 days)
        },
      }
    );

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No travel plans found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch public travel plans");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error("Get public travel plans error:", error);

    // Return empty response instead of throwing for better UX
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to fetch travel plans. Please try again.",
      meta: {
        page: filters.page || 1,
        limit: filters.limit || 10,
        total: 0,
      },
      data: [],
    };
  }
}

export async function deleteTravelPlan(planId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await serverFetch.delete(`/travel-plans/${planId}`);

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this plan",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Travel plan not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to delete travel plan"
      );
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    return {
      success: true,
      message: data.message || "Travel plan deleted successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Delete travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to delete travel plan. Please try again.",
    };
  }
}

export const createTravelPlan = async (
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    // Extract form data
    const payload: Record<string, unknown> = {
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

    const validatedPayload: Record<string, unknown> = validationResult.data || {};

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
    const jsonPayload: Record<string, unknown> = {
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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Create travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to create travel plan. Please try again.",
    };
  }
};
