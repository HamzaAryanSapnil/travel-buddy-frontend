"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createTravelPlanValidationSchema } from "@/zod/travelPlan.validation";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/auth-utils";

export async function verifyUser(
  userId: string,
  isVerified: boolean
): Promise<VerifyUserResponse> {
  try {
    const response = await serverFetch.patch(`/users/admin/${userId}/verify`, {
      body: JSON.stringify({ isVerified }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to verify user",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to verify user",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to verify user",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User verification status updated successfully",
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Verify user error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to verify user"
          : "Failed to verify user. Please try again.",
    };
  }
}

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "DELETED"
): Promise<UpdateUserStatusResponse> {
  try {
    const response = await serverFetch.patch(`/users/admin/${userId}/status`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update user status",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update user status",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update user status",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User status updated successfully",
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Update user status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to update user status"
          : "Failed to update user status. Please try again.",
    };
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResponse> {
  try {
    const response = await serverFetch.patch(`/users/admin/${userId}/role`, {
      body: JSON.stringify({ role }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update user role",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update user role",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update user role",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User role updated successfully",
      data: data.data,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Update user role error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to update user role"
          : "Failed to update user role. Please try again.",
    };
  }
}

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  try {
    const response = await serverFetch.delete(`/users/admin/${userId}`);

    // Handle 401 - unauthorized
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete user",
      };
    }

    // Handle 403 - forbidden
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete user",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to delete user",
      };
    }

    const data = await response.json();

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User deleted successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Delete user error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to delete user"
          : "Failed to delete user. Please try again.",
    };
  }
}

export async function deleteAdminTravelPlan(planId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await serverFetch.delete(`/travel-plans/admin/${planId}`);

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
    // Revalidate both admin and regular travel plans cache
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    return {
      success: true,
      message: data.message || "Travel plan deleted successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Delete admin travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined)
          : "Failed to delete travel plan. Please try again.",
    };
  }
}

export async function toggleTravelPlanFeatured(
  planId: string,
  isFeatured: boolean
): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await serverFetch.patch(
      `/travel-plans/admin/${planId}`,
      {
        body: JSON.stringify({ isFeatured }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to update this plan",
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
        errorData.message || "Failed to toggle featured status"
      );
    }

    const data = await response.json();

    // Revalidate both admin and regular travel plans cache
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`travel-plan-${planId}`);

    return {
      success: true,
      message:
        data.message ||
        `Travel plan ${isFeatured ? "marked as" : "removed from"} featured successfully`,
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Toggle travel plan featured error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined)
          : "Failed to toggle featured status. Please try again.",
    };
  }
}

export async function getAllUsers(
  filters: AdminUserFilters = {}
): Promise<AdminUsersResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.role) params.set("role", filters.role);
    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.isVerified !== undefined)
      params.set("isVerified", filters.isVerified.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/users/admin${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-users"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view users");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No users found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();
    console.log("data from getAllUsers: ", data);

    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Get all users error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : undefined)
        : "Failed to fetch users. Please try again."
    );
  }
}

export async function getAllSubscriptions(
  filters: AdminSubscriptionFilters = {}
): Promise<AdminSubscriptionsResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.planType) params.set("planType", filters.planType);
    if (filters.searchTerm) params.set("planName", filters.searchTerm);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/subscriptions${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-subscriptions"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view subscriptions");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No subscriptions found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch subscriptions");
    }

    const data: AdminSubscriptionsResponse = await response.json();
    
    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Get all subscriptions error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : undefined)
        : "Failed to fetch subscriptions. Please try again."
    );
  }
}

export async function getAdminTravelPlans(
  filters: AdminTravelPlansFilters = {}
): Promise<TravelPlansResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.travelType) params.set("travelType", filters.travelType);
    if (filters.visibility) params.set("visibility", filters.visibility);
    if (filters.isFeatured !== undefined)
      params.set("isFeatured", filters.isFeatured.toString());
    if (filters.ownerId) params.set("ownerId", filters.ownerId);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/travel-plans/admin${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-travel-plans"] },
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
          limit: filters.limit || 12,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch travel plans");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Get admin travel plans error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : undefined)
        : "Failed to fetch travel plans. Please try again."
    );
  }
}

export async function getAdminPayments(
  filters: AdminPaymentFilters = {}
): Promise<AdminPaymentsResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.userId) params.set("userId", filters.userId);
    if (filters.subscriptionId)
      params.set("subscriptionId", filters.subscriptionId);
    if (filters.currency) params.set("currency", filters.currency);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/payments${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-payments"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view payments");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No payments found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }

    const data: AdminPaymentsResponse = await response.json();
    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

    console.error("Get admin payments error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : undefined)
        : "Failed to fetch payments. Please try again."
    );
  }
}

export async function getAdminPaymentStatistics(filters?: {
  startDate?: string;
  endDate?: string;
  subscriptionId?: string;
  currency?: string;
}): Promise<{
  data: AdminPaymentStatisticsResponse["data"] | null;
  error: string | null;
}> {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    if (filters?.subscriptionId)
      params.set("subscriptionId", filters.subscriptionId);
    if (filters?.currency) params.set("currency", filters.currency);

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/payments/statistics${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-payment-statistics"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      return {
        data: null,
        error: "Please log in to view payment statistics",
      };
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      return {
        data: null,
        error: "You don't have permission to view payment statistics",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.message || "Failed to fetch payment statistics",
      };
    }
    const data: AdminPaymentStatisticsResponse = await response.json();
    return { data: data.data || null, error: null };
  } catch (error: unknown) {
    console.error("Get admin payment statistics error:", error);
    return {
      data: null,
      error:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to fetch payment statistics"
          : "Failed to fetch payment statistics. Please try again.",
    };
  }
}

export const updateAdminTravelPlan = async (
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
  } catch (error: unknown) {
    if (
        typeof error === "object" &&
        error !== null &&
        "digest" in error &&
        typeof (error as { digest?: unknown }).digest === "string" &&
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    console.error("Update admin travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined)
          : "Failed to update travel plan. Please try again.",
    };
  }
};
