/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { updateSubscriptionSchema } from "@/zod/subscription.validation";
import { UpdateSubscriptionResponse } from "@/types/subscription.interface";

export const updateSubscription = async (
  subscriptionId: string,
  _currentState: any,
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
  } catch (error: any) {
    console.error("Update subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update subscription"
          : "Failed to update subscription. Please try again.",
      data: undefined,
    };
  }
};

