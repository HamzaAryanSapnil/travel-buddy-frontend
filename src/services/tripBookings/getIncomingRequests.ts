"use server";

import { serverFetch } from "@/lib/server-fetch";
import { PlanBookingsResponse } from "@/types/tripBooking.interface";

export async function getIncomingRequests(
  planId: string
): Promise<PlanBookingsResponse> {
  try {
    const response = await serverFetch.get(`/trip-bookings/plan/${planId}`, {
      next: {
        tags: [`incoming-requests-${planId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch incoming requests",
        data: [],
      };
    }

    return data;
  } catch (error: any) {
    console.error("Get incoming requests error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch incoming requests",
      data: [],
    };
  }
}

