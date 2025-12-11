/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { PaymentSummary } from "@/types/payment.interface";

export async function getPaymentSummary(): Promise<{
  data: PaymentSummary | null;
  error: string | null;
}> {
  try {
    const response = await serverFetch.get("/payments/summary");

    if (response.status === 401) {
      return {
        data: null,
        error: "Please log in to view payment summary",
      };
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        data: null,
        error: data.message || "Failed to fetch payment summary",
      };
    }

    const data = await response.json();
    return { data: data.data || null, error: null };
  } catch (error: any) {
    return {
      data: null,
      error:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch payment summary"
          : "Failed to fetch payment summary. Please try again.",
    };
  }
}

