/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { MediaItem, MediaResponse } from "@/types/media.interface";

interface GetMediaFilters {
  limit?: number;
  type?: "photo" | "video";
}

/**
 * Fetch media files for a plan
 * Note: Media API requires authentication. Returns empty array for unauthenticated users (graceful degradation).
 */
export async function getMedia(
  planId: string,
  { limit = 9, type = "photo" }: GetMediaFilters = {}
): Promise<{ data: MediaItem[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set("planId", planId);
    if (type) params.set("type", type);
    if (limit) params.set("limit", limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(`/media?${queryString}`, {
      next: {
        tags: [`trip-media-${planId}`],
      },
    });

    // Handle 401/403 - user not authenticated or no access (graceful degradation)
    if (response.status === 401 || response.status === 403) {
      return { data: [], error: null };
    }

    // Handle 404 - no media found
    if (response.status === 404) {
      return { data: [], error: null };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch media");
    }

    const result: MediaResponse = await response.json();
    return { data: result.data, error: null };
  } catch (error: any) {
    console.error("Get media error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
}

