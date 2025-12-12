/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { Payment, PaymentsResponse } from "@/types/payment.interface";

interface PaymentFilters {
  status?: string;
  subscriptionId?: string;
  page?: number;
  limit?: number;
}

export async function getPayments(
  filters: PaymentFilters = {}
): Promise<{ data: Payment[]; error: string | null }> {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.subscriptionId)
      params.set("subscriptionId", filters.subscriptionId);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    // Use /payments/my-payments endpoint for user's own payments
    const response = await serverFetch.get(
      `/payments/my-payments${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["payments"] },
      }
    );

    // 404 means no payments yet, not an error
    if (response.status === 404) {
      return { data: [], error: null };
    }

    // 403 means user doesn't have permission
    // Backend should filter by authenticated user automatically, but if it doesn't,
    // we'll handle gracefully - regular users should only see their own payments
    if (response.status === 403) {
      // Return empty array instead of error - user just has no payments visible
      return { data: [], error: null };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Log error in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Get payments API error:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
      }

      // Return error in development, empty state in production
      return {
        data: [],
        error:
          process.env.NODE_ENV === "development"
            ? errorData.message ||
              `Failed to fetch payments (${response.status})`
            : null,
      };
    }

    const data = await response.json();
    // Log response in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Get payments response:", {
        success: data.success,
        message: data.message,
        dataLength: data.data?.length || 0,
        data: data.data,
      });
    }

    // Handle different response structures
    // Backend might return array directly or wrapped in { data: [...] }
    const payments = Array.isArray(data)
      ? data
      : data.data || (data as any).payments || [];

    return {
      data: payments,
      error: null,
    };
  } catch (error: any) {
    console.error("Get payments error:", error);
    return {
      data: [],
      error:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch payments"
          : "Failed to fetch payments. Please try again.",
    };
  }
}
