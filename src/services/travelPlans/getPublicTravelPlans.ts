/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicFetch } from "@/lib/public-fetch";
import {
  TravelPlansResponse,
  TravelPlansFilters,
} from "@/types/travelPlan.interface";
import { unstable_cache } from "next/cache";

/**
 * Get public travel plans (no authentication required)
 * Uses /api/v1/travel-plans/public endpoint
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getPublicTravelPlans(
  filters: TravelPlansFilters = {}
): Promise<TravelPlansResponse> {
  const cacheKey = `travel-plans-public-${JSON.stringify(filters)}`;

  return unstable_cache(
    async () => {
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
          `/travel-plans/public${queryString ? `?${queryString}` : ""}`
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
      } catch (error: any) {
        console.error("Get public travel plans error:", error);

        // Return empty response instead of throwing for better UX
        return {
          success: false,
          message:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Failed to fetch travel plans. Please try again.",
          meta: {
            page: filters.page || 1,
            limit: filters.limit || 10,
            total: 0,
          },
          data: [],
        };
      }
    },
    [cacheKey],
    {
      tags: ["travel-plans"], // Tag for revalidation
      revalidate: 259200, // Fallback: revalidate every 72 hours (3 days)
    }
  )();
}
