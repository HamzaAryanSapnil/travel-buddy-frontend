"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function cancelRequest(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/trip-bookings/${bookingId}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel request",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag("my-requests");

    return {
      success: true,
      message: data.message || "Request cancelled successfully",
    };
  } catch (error: any) {
    console.error("Cancel request error:", error);
    return {
      success: false,
      message: error.message || "Failed to cancel request",
    };
  }
}

