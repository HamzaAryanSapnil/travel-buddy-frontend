/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { TravelPlansResponse, TravelPlansFilters } from "@/types/travelPlan.interface";
import { redirect } from "next/navigation";

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
      const originalLimit = filters.limit || 10;
      params.set("limit", "1000"); // Fetch up to 1000 items for filtering
    }

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/travel-plans${queryString ? `?${queryString}` : ""}`
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

      const filteredData = data.data.filter((plan: any) => {
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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get travel plans error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch travel plans. Please try again."
    );
  }
}

