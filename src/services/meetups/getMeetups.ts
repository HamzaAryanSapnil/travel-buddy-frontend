/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { Meetup } from "@/types/meetup.interface";

interface GetMeetupsFilters {
  planId?: string;
  status?: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
}

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
  } catch (error: any) {
    console.error("Get meetups error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}

