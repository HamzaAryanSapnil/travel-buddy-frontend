/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { createSubscriptionSchema } from "@/zod/subscription.validation";
import { CreateSubscriptionResponse } from "@/types/subscription.interface";

export const createSubscription = async (
  _currentState: any,
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
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to create subscription"
          : "Failed to create subscription. Please try again.",
      data: undefined,
    };
  }
};
