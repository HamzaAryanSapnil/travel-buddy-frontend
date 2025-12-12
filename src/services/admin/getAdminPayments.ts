/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  AdminPaymentsResponse,
  AdminPaymentFilters,
  AdminPaymentStatisticsResponse,
} from "@/types/admin.interface";
import { redirect } from "next/navigation";

export async function getAdminPayments(
  filters: AdminPaymentFilters = {}
): Promise<AdminPaymentsResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.userId) params.set("userId", filters.userId);
    if (filters.subscriptionId)
      params.set("subscriptionId", filters.subscriptionId);
    if (filters.currency) params.set("currency", filters.currency);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/payments${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-payments"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view payments");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No payments found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch payments");
    }

    const data: AdminPaymentsResponse = await response.json();
    return data;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get admin payments error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch payments. Please try again."
    );
  }
}

export async function getAdminPaymentStatistics(filters?: {
  startDate?: string;
  endDate?: string;
  subscriptionId?: string;
  currency?: string;
}): Promise<{
  data: AdminPaymentStatisticsResponse["data"] | null;
  error: string | null;
}> {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.set("startDate", filters.startDate);
    if (filters?.endDate) params.set("endDate", filters.endDate);
    if (filters?.subscriptionId)
      params.set("subscriptionId", filters.subscriptionId);
    if (filters?.currency) params.set("currency", filters.currency);

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/payments/statistics${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-payment-statistics"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      return {
        data: null,
        error: "Please log in to view payment statistics",
      };
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      return {
        data: null,
        error: "You don't have permission to view payment statistics",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.message || "Failed to fetch payment statistics",
      };
    }
    const data: AdminPaymentStatisticsResponse = await response.json();
    return { data: data.data || null, error: null };
  } catch (error: any) {
    console.error("Get admin payment statistics error:", error);
    return {
      data: null,
      error:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch payment statistics"
          : "Failed to fetch payment statistics. Please try again.",
    };
  }
}
