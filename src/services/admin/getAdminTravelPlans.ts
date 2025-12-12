/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { TravelPlansResponse } from "@/types/travelPlan.interface";
import { AdminTravelPlansFilters } from "@/types/admin.interface";
import { redirect } from "next/navigation";

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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get admin travel plans error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch travel plans. Please try again."
    );
  }
}

