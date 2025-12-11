/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Delete media error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to delete media"
          : "Failed to delete media. Please try again.",
    };
  }
}

