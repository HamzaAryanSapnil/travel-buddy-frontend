/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { SubscriptionStatusResponse } from "@/types/subscription.interface";

export async function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  try {
    const response = await serverFetch.get("/subscriptions/status", {
      next: { tags: ["subscription-status"] },
    });

    // 404 means no subscription exists, which is valid
    if (response.status === 404) {
      return {
        success: true,
        message: "No active subscription",
        data: null,
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to fetch subscription status",
        data: undefined,
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Get subscription status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch subscription status"
          : "Failed to fetch subscription status. Please try again.",
      data: undefined,
    };
  }
}
