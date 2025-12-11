/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ItineraryDaysResponse } from "@/types/itinerary.interface";

export async function getItineraryItems(
  planId: string
): Promise<ItineraryDaysResponse> {
  try {
    const response = await serverFetch.get(`/itinerary/${planId}`, {
      next: {
        tags: [`trip-itinerary-${planId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch itinerary items",
        data: {
          days: [],
          totalDays: 0,
        },
      };
    }

    

    return data;
  } catch (error: any) {
    console.error("Get itinerary items error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch itinerary items",
      data: {
        days: [],
        totalDays: 0,
      },
    };
  }
}
