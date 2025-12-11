/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTravelPlan(planId: string): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await serverFetch.delete(`/travel-plans/${planId}`);

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete this plan",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "Travel plan not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to delete travel plan"
      );
    }

    const data = await response.json();
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    return {
      success: true,
      message: data.message || "Travel plan deleted successfully",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Delete travel plan error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to delete travel plan. Please try again.",
    };
  }
}

