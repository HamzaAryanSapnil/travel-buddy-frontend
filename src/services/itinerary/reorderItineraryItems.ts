"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function reorderItineraryItems(
  planId: string,
  updates: Array<{ id: string; dayIndex: number; order: number }>
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(`/itinerary/reorder`, {
      body: JSON.stringify({ planId, updates }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to reorder items",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`trip-itinerary-${planId}`);

    return {
      success: true,
      message: data.message || "Items reordered successfully",
    };
  } catch (error: any) {
    console.error("Reorder itinerary items error:", error);
    return {
      success: false,
      message: error.message || "Failed to reorder items",
    };
  }
}

