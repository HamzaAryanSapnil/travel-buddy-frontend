/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  NotificationsResponse,
  NotificationType,
} from "@/types/notification.interface";
import { redirect } from "next/navigation";

export interface GetNotificationsFilters {
  isRead?: boolean;
  type?: NotificationType;
  page?: number;
  limit?: number;
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
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get notifications error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch notifications. Please try again."
    );
  }
}

