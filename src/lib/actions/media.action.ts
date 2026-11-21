"use server";

import { publicFetch } from "@/lib/public-fetch";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";

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
  } catch (error: unknown) {
    console.error("Get media error:", error);
    // Return empty array instead of error for graceful degradation
    return {
      data: [],
      error: null, // Don't show error to user, just show empty state
    };
  }
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
  } catch (error: unknown) {
    console.error("Get public gallery error:", error);

    // Return empty response instead of throwing for better UX
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
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

export const uploadMedia = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    // Get imageUrls from FormData (uploaded to imgBB client-side)
    const imageUrlsStr = formData.get("imageUrls");
    let imageUrls: string[] = [];

    if (imageUrlsStr) {
      if (typeof imageUrlsStr === "string") {
        try {
          imageUrls = JSON.parse(imageUrlsStr);
        } catch {
          // If not JSON, treat as single URL
          imageUrls = [imageUrlsStr];
        }
      }
    }

    // Validate imageUrls
    if (!imageUrls || imageUrls.length === 0) {
      return {
        success: false,
        message: "Please upload at least one image",
        errors: [
          {
            field: "files",
            message: "At least one image is required",
          },
        ],
      };
    }

    // Validate URLs are strings
    const invalidUrls = imageUrls.filter((url) => typeof url !== "string" || !url.trim());
    if (invalidUrls.length > 0) {
      return {
        success: false,
        message: "Invalid image URLs provided",
        errors: [
          {
            field: "files",
            message: "Some image URLs are invalid",
          },
        ],
      };
    }

    // Get optional type parameter
    const type = formData.get("type")?.toString() || "photo";

    // Build JSON payload for API request
    const payload = {
      imageUrls: imageUrls,
      planId: planId,
      type: type,
    };

    // Send request to API with JSON
    const response = await serverFetch.post(`/media`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to upload media",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to upload media to this plan",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Travel plan not found",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to upload media",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to upload media";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // Revalidate cache
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-media-${planId}`);
    // Also revalidate the travel plan since media is shown on plan detail page
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`travel-plan-${planId}`);

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Media uploaded successfully";

    return {
      success: true,
      message: message,
      data: data.data || (Array.isArray(data.data) ? data.data : []),
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Upload media error:", error);
    const errorMessage =
      error instanceof Error && error.message
        ? error.message
        : "Failed to upload media";

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Failed to upload media. Please try again.",
    };
  }
};

export async function deleteMedia(
  planId: string,
  mediaId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/media/${mediaId}`);

    // Handle 401 - redirect to login (if needed, can add redirect import)
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete this media",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this media",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Media not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to delete media"
      );
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-media-${planId}`);

    return {
      success: true,
      message: data.message || "Media deleted successfully",
    };
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors if any
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Delete media error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to delete media"
          : "Failed to delete media. Please try again.",
    };
  }
}
