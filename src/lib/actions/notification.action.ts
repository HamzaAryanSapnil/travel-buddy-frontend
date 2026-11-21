"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";

export async function deleteNotification(
  notificationId: string
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

    console.error("Delete notification error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to delete notification"
          : "Failed to delete notification. Please try again.",
    };
  }
}

export async function markAllAsRead(): Promise<MarkAllAsReadResponse> {
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

    console.error("Mark all as read error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to mark all notifications as read"
          : "Failed to mark all notifications as read. Please try again.",
    };
  }
}

export async function markAsRead(
  notificationId: string
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

    console.error("Mark as read error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Failed to mark notification as read"
          : "Failed to mark notification as read. Please try again.",
    };
  }
}

export async function getNotifications(
  filters: GetNotificationsFilters = {}
): Promise<NotificationsResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.isRead !== undefined)
      params.set("isRead", filters.isRead.toString());
    if (filters.type) params.set("type", filters.type);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/notifications${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["notifications"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      throw new Error("You don't have permission to view notifications");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No notifications found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data: NotificationsResponse = await response.json();
    return data;
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Get notifications error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
        : "Failed to fetch notifications. Please try again."
    );
  }
}

/**
 * Get unread notification count for the current user
 * @returns Unread count (0 if error or no unread notifications)
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await serverFetch.get("/notifications/unread-count", {
      cache: "no-store", // Always fetch fresh count
      next: { tags: ["notifications"] },
    });

    const result: UnreadCountResponse = await response.json();

    if (result.success && result.data) {
      return result.data.count || 0;
    }

    return 0;
  } catch (error: unknown) {
    console.error("Get unread count error:", error);
    return 0; // Return 0 on error (graceful degradation)
  }
};
