/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleTravelPlanFeatured(
  planId: string,
  isFeatured: boolean
): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await serverFetch.patch(
      `/travel-plans/admin/${planId}`,
      {
        body: JSON.stringify({ isFeatured }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to update this plan",
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
        errorData.message || "Failed to toggle featured status"
      );
    }

    const data = await response.json();

    // Revalidate both admin and regular travel plans cache
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("travel-plans");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`travel-plan-${planId}`);

    return {
      success: true,
      message:
        data.message ||
        `Travel plan ${isFeatured ? "marked as" : "removed from"} featured successfully`,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Toggle travel plan featured error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to toggle featured status. Please try again.",
    };
  }
}

