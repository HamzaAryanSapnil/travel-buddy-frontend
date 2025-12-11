/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export async function markAsRead(
  notificationId: string,
  _currentState: any,
  formData: FormData
): Promise<MarkAsReadResponse> {
  try {
    const response = await serverFetch.patch(
      `/notifications/${notificationId}/read`,
      {
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to mark notification as read",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to mark this notification as read",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "Notification not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to mark notification as read",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("notifications");

    return {
      success: true,
      message: data.message || "Notification marked as read",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Mark as read error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to mark notification as read"
          : "Failed to mark notification as read. Please try again.",
    };
  }
}

