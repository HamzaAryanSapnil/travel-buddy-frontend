"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createSubscriptionSchema, updateSubscriptionSchema } from "@/zod/subscription.validation";

export const createSubscription = async (
  _currentState: unknown,
  formData: FormData
): Promise<CreateSubscriptionResponse> => {
  try {
    const payload = {
      planType: formData.get("planType"),
    };

    const validation = zodValidator(payload, createSubscriptionSchema);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        data: undefined,
      };
    }

    const response = await serverFetch.post("/subscriptions", {
      body: JSON.stringify(validation.data),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create subscription",
        data: data.data,
      };
    }

    return {
      success: true,
      message: data.message || "Subscription created",
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Create subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to create subscription"
          : "Failed to create subscription. Please try again.",
      data: undefined,
    };
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  _currentState: unknown,
  formData: FormData
): Promise<UpdateSubscriptionResponse> => {
  try {
    const cancelAtPeriodEndValue = formData.get("cancelAtPeriodEnd");
    const payload = {
      cancelAtPeriodEnd: cancelAtPeriodEndValue === "true",
    };

    const validation = zodValidator(payload, updateSubscriptionSchema);
    if (!validation.success) {
      return {
        success: false,
        message: "Validation failed",
        data: undefined,
      };
    }

    const response = await serverFetch.patch(
      `/subscriptions/${subscriptionId}`,
      {
        body: JSON.stringify(validation.data),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update subscription",
        data: undefined,
      };
    }

    return {
      success: true,
      message: data.message || "Subscription updated",
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Update subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to update subscription"
          : "Failed to update subscription. Please try again.",
      data: undefined,
    };
  }
};

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
  } catch (error: unknown) {
    console.error("Cancel subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to cancel subscription"
          : "Failed to cancel subscription. Please try again.",
    };
  }
};

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
  } catch (error: unknown) {
    console.error("Get subscription status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : undefined) || "Failed to fetch subscription status"
          : "Failed to fetch subscription status. Please try again.",
      data: undefined,
    };
  }
}
