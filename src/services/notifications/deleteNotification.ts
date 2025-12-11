/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export async function deleteNotification(
  notificationId: string,
  _currentState: any,
  formData: FormData
): Promise<DeleteNotificationResponse> {
  try {
    const response = await serverFetch.delete(`/notifications/${notificationId}`);

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to delete notification",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to delete this notification",
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
        message: data.message || "Failed to delete notification",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("notifications");

    return {
      success: true,
      message: data.message || "Notification deleted successfully",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Delete notification error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to delete notification"
          : "Failed to delete notification. Please try again.",
    };
  }
}

