/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { Review, ReviewsResponse } from "@/types/review.interface";

interface GetReviewsFilters {
  planId: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Fetch reviews for a plan
 * Note: Reviews API requires authentication. Returns empty array for unauthenticated users (graceful degradation).
 */
export async function getReviews(
  filters: GetReviewsFilters
): Promise<{ data: Review[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set("planId", filters.planId);
    params.set("source", "USER_TO_TRIP"); // Only trip reviews for plan details
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    const response = await serverFetch.get(`/reviews?${queryString}`);

    // Handle 401/403 - user not authenticated or no access (graceful degradation)
    if (response.status === 401 || response.status === 403) {
      return { data: [], error: null };
    }

    // Handle 404 - no reviews found
    if (response.status === 404) {
      return { data: [], error: null };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const result: ReviewsResponse = await response.json();
    return { data: result.data || [], error: null };
  } catch (error: any) {
    console.error("Get reviews error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}
