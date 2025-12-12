/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { MediaItem } from "@/types/media.interface";

export const uploadMedia = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Upload media error:", error);
    const errorMessage =
      error?.message && typeof error.message === "string"
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

