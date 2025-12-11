"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { BookingResponse, BookingStatus } from "@/types/tripBooking.interface";

export async function respondToRequest(
  bookingId: string,
  status: "APPROVED" | "REJECTED",
  planId: string // Needed for revalidation tag
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(
      `/trip-bookings/${bookingId}/respond`,
      {
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: BookingResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to respond to request",
      };
    }

    // Revalidate incoming requests for the specific plan
    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag(`incoming-requests-${planId}`);
    
    // If approved, member list changes, so revalidate members
    if (status === "APPROVED") {
        // @ts-expect-error - revalidateTag signature mismatch in this environment
        revalidateTag(`trip-members-${planId}`); 
    }

    return {
      success: true,
      message: data.message || `Request ${status.toLowerCase()} successfully`,
    };
  } catch (error: any) {
    console.error("Respond to request error:", error);
    return {
      success: false,
      message: error.message || "Failed to respond to request",
    };
  }
}

