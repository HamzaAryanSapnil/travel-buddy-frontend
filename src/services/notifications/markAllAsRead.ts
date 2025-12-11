/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
}

export async function markAllAsRead(
  _currentState: any,
  formData: FormData
): Promise<MarkAllAsReadResponse> {
  try {
    const response = await serverFetch.patch("/notifications/read-all", {
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to mark all notifications as read",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message:
            "You don't have permission to mark all notifications as read",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to mark all notifications as read",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("notifications");

    return {
      success: true,
      message: data.message || "All notifications marked as read",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Mark all as read error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to mark all notifications as read"
          : "Failed to mark all notifications as read. Please try again.",
    };
  }
}

