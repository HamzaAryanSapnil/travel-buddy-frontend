/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { publicFetch } from "@/lib/public-fetch";
import { serverFetch } from "@/lib/server-fetch";
import { getCookie } from "@/services/auth/tokenHandlers";
import { unstable_cache } from "next/cache";

export interface TravelPlanDetail {
  id: string;
  title: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  travelType: "SOLO" | "COUPLE" | "FAMILY" | "FRIENDS" | "GROUP";
  budgetMin: number;
  budgetMax?: number;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  coverPhoto?: string | null;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    fullName?: string;
    profileImage?: string;
  };
  _count?: {
    itineraryItems?: number;
    tripMembers?: number;
  };
  totalDays?: number;
}

export interface TravelPlanResponse {
  success: boolean;
  message: string;
  data: TravelPlanDetail;
}

/**
 * Get single travel plan by ID
 * Uses public fetch for PUBLIC plans, authenticated fetch for PRIVATE/UNLISTED
 * Returns error codes: 401 (auth required), 403 (no access), 404 (not found)
 * Cached with revalidate tags for on-demand invalidation
 */
export async function getTravelPlan(
  planId: string
): Promise<{ data: TravelPlanDetail | null; error: string | null; statusCode?: number }> {
  return unstable_cache(
    async () => {
      try {
        const accessToken = await getCookie("accessToken");
        
        // Try public fetch first
        const response = accessToken
          ? await serverFetch.get(`/travel-plans/${planId}`)
          : await publicFetch.get(`/travel-plans/${planId}`);

        // Handle specific status codes
        if (response.status === 401) {
          return {
            data: null,
            error: "Please log in to view this plan",
            statusCode: 401,
          };
        }

        if (response.status === 403) {
          return {
            data: null,
            error: "You don't have permission to view this plan",
            statusCode: 403,
          };
        }

        if (response.status === 404) {
          return {
            data: null,
            error: "Travel plan not found",
            statusCode: 404,
          };
        }

        if (!response.ok) {
          throw new Error("Failed to fetch travel plan");
        }

        const result: TravelPlanResponse = await response.json();
        return {
          data: result.data,
          error: null,
        };
      } catch (error: any) {
        console.error("Get travel plan error:", error);
        return {
          data: null,
          error:
            process.env.NODE_ENV === "development"
              ? error.message
              : "Failed to fetch travel plan. Please try again.",
          statusCode: 500,
        };
      }
    },
    [`travel-plan-${planId}`],
    {
      tags: ["travel-plans", `travel-plan-${planId}`], // General and specific tags
      revalidate: 259200, // Fallback: revalidate every 72 hours (3 days)
    }
  )();
}

