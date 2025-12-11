"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { BookingResponse } from "@/types/tripBooking.interface";

export async function sendJoinRequest(
  planId: string,
  message?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.post("/trip-bookings/request", {
      body: JSON.stringify({ planId, message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: BookingResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to send join request",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag("my-requests");
    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag(`travel-plan-${planId}`); // Optional: revalidate plan details if needed

    return {
      success: true,
      message: data.message || "Join request sent successfully",
    };
  } catch (error: any) {
    console.error("Send join request error:", error);
    return {
      success: false,
      message: error.message || "Failed to send join request",
    };
  }
}

