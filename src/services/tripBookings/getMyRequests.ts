"use server";

import { serverFetch } from "@/lib/server-fetch";
import { MyBookingsResponse } from "@/types/tripBooking.interface";

export async function getMyRequests(): Promise<MyBookingsResponse> {
  try {
    const response = await serverFetch.get("/trip-bookings/my-requests", {
      next: {
        tags: ["my-requests"],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch my requests",
        data: [],
      };
    }

    return data;
  } catch (error: any) {
    console.error("Get my requests error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch my requests",
      data: [],
    };
  }
}

