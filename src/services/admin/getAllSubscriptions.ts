/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  AdminSubscriptionsResponse,
  AdminSubscriptionFilters,
} from "@/types/admin.interface";
import { redirect } from "next/navigation";

export async function getAllSubscriptions(
  filters: AdminSubscriptionFilters = {}
): Promise<AdminSubscriptionsResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.planType) params.set("planType", filters.planType);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/admin/subscriptions${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-subscriptions"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view subscriptions");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No subscriptions found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch subscriptions");
    }

    const data: AdminSubscriptionsResponse = await response.json();
    return data;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get all subscriptions error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch subscriptions. Please try again."
    );
  }
}

