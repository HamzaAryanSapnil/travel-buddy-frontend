/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  ReviewStatistics,
  ReviewStatisticsResponse,
} from "@/types/review.interface";

/**
 * Fetch review statistics for a plan
 * Note: Reviews API requires authentication. Returns null for unauthenticated users (graceful degradation).
 */
export async function getReviewStatistics(
  planId: string
): Promise<{ data: ReviewStatistics | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set("planId", planId);

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/reviews/statistics?${queryString}`
    );

    // Handle 401/403 - user not authenticated or no access (graceful degradation)
    if (response.status === 401 || response.status === 403) {
      return { data: null, error: null };
    }

    // Handle 404 - no statistics found
    if (response.status === 404) {
      return { data: null, error: null };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch review statistics");
    }

    const result: ReviewStatisticsResponse = await response.json();
    return { data: result.data || null, error: null };
  } catch (error: any) {
    console.error("Get review statistics error:", error);
    // Return null instead of error for graceful degradation
    return {
      data: null,
      error: null, // Don't show error to user, just show empty state
    };
  }
}

