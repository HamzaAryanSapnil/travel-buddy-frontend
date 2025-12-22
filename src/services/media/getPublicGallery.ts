/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicFetch } from "@/lib/public-fetch";

export interface PublicGalleryItem {
  id: string;
  url: string;
  planId: string | null;
  planTitle: string | null;
  destination: string | null;
  createdAt: string;
}

export interface PublicGalleryResponse {
  success: boolean;
  message: string;
  data: PublicGalleryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Get public gallery images (no authentication required)
 * Uses /api/v1/media/public/gallery endpoint
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getPublicGallery(
  limit: number = 20,
  type: "photo" | "video" = "photo"
): Promise<PublicGalleryResponse> {
  try {
    // Build query string
    const params = new URLSearchParams();
    params.set("limit", limit.toString());
    params.set("type", type);

    const queryString = params.toString();
    const response = await publicFetch.get(
      `/media/public/gallery?${queryString}`,
      {
        next: {
          tags: ["public-gallery"],
          revalidate: 259200, // Fallback: revalidate every 72 hours (3 days)
        },
      }
    );

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No gallery images found",
        meta: {
          page: 1,
          limit: limit,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch public gallery");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Get public gallery error:", error);

    // Return empty response instead of throwing for better UX
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch gallery images. Please try again.",
      meta: {
        page: 1,
        limit: limit,
        total: 0,
      },
      data: [],
    };
  }
}

