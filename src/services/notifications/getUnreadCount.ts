/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UnreadCountResponse } from "@/types/notification.interface";

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
  } catch (error: any) {
    console.error("Get unread count error:", error);
    return 0; // Return 0 on error (graceful degradation)
  }
};

