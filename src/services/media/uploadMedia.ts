/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { validateImageFile } from "@/lib/file-upload";
import { revalidateTag } from "next/cache";
import { MediaItem } from "@/types/media.interface";

export const uploadMedia = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Get files from FormData
    const files = formData.getAll("files") as File[];

    // Validate files
    if (!files || files.length === 0) {
      return {
        success: false,
        message: "Please select at least one file to upload",
        errors: [
          {
            field: "files",
            message: "At least one file is required",
          },
        ],
      };
    }

    // Validate each file
    const validationErrors: Array<{ field: string; message: string }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!(file instanceof File)) {
        continue;
      }

      const validation = validateImageFile(file);
      if (!validation.valid) {
        validationErrors.push({
          field: `files[${i}]`,
          message: validation.error || "Invalid file",
        });
      }
    }

    if (validationErrors.length > 0) {
      return {
        success: false,
        message: "File validation failed",
        errors: validationErrors,
      };
    }

    // Build FormData for API request
    const outgoing = new FormData();
    outgoing.append("planId", planId);
    files.forEach((file) => {
      if (file instanceof File) {
        outgoing.append("files", file);
      }
    });

    // Send request to API
    const response = await serverFetch.post(`/media`, {
      body: outgoing,
      // No explicit Content-Type; fetch will set multipart boundary
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

