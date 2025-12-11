"use server";

import { serverFetch } from "@/lib/server-fetch";
import { TripMembersResponse } from "@/types/tripMembers.interface";

export async function getTripMembers(
  planId: string
): Promise<TripMembersResponse> {
  try {
    const response = await serverFetch.get(`/trip-members/${planId}`, {
      next: {
        tags: [`trip-members-${planId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch trip members",
        data: [],
      };
    }

    return data;
  } catch (error: any) {
    console.error("Get trip members error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch trip members",
      data: [],
    };
  }
}

