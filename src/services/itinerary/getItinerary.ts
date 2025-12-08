/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import { getCookie } from "@/services/auth/tokenHandlers";
import { unstable_cache } from "next/cache";

export interface ItineraryLocation {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface ItineraryItem {
  id: string;
  planId: string;
  dayIndex: number;
  startAt?: string;
  endAt?: string;
  title: string;
  description?: string;
  locationId?: string;
  order: number;
  location?: ItineraryLocation;
}

export interface ItineraryDay {
  day: number;
  items: ItineraryItem[];
}

export interface ItineraryResponse {
  success: boolean;
  message: string;
  data: {
    days: ItineraryDay[];
    totalDays: number;
  };
}

/**
 * Get itinerary for a travel plan
 * Public for PUBLIC plans, authenticated for PRIVATE/UNLISTED
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getItinerary(
  planId: string
): Promise<{ data: ItineraryDay[] | null; error: string | null }> {
  return unstable_cache(
    async () => {
      try {
        const accessToken = await getCookie("accessToken");
        
        // Try public fetch first, authenticated if logged in
        const response = accessToken
          ? await serverFetch.get(`/itinerary/${planId}`)
          : await publicFetch.get(`/itinerary/${planId}`);

        // Handle 401 - plan is private
        if (response.status === 401) {
          return {
            data: null,
            error: "Please log in to view this itinerary",
          };
        }

        if (response.status === 404) {
          return {
            data: [],
            error: null,
          };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch itinerary");
        }

        const result: ItineraryResponse = await response.json();
        return {
          data: result.data.days,
          error: null,
        };
      } catch (error: any) {
        console.error("Get itinerary error:", error);
        return {
          data: null,
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Failed to fetch itinerary. Please try again.",
        };
      }
    },
    [`travel-itinerary-${planId}`],
    {
      tags: ["travel-itinerary", `travel-plan-${planId}`], // Tag for itinerary and plan
      revalidate: 259200, // Fallback: revalidate every 72 hours (3 days)
    }
  )();
}

