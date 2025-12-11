/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export const cancelSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await serverFetch.delete(`/subscriptions/${subscriptionId}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel subscription",
      };
    }

    return {
      success: true,
      message: data.message || "Subscription cancelled",
    };
  } catch (error: any) {
    console.error("Cancel subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to cancel subscription"
          : "Failed to cancel subscription. Please try again.",
    };
  }
};
