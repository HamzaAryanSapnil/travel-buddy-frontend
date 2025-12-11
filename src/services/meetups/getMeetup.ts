/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { Meetup } from "@/types/meetup.interface";

export async function getMeetup(
  meetupId: string
): Promise<{ data?: Meetup; error: string | null }> {
  try {
    const response = await serverFetch.get(`/meetups/${meetupId}`, {
      next: {
        tags: [`meetup-${meetupId}`],
      },
    });

    // Handle 401 - user not authenticated
    if (response.status === 401) {
      return {
        data: undefined,
        error: "Please log in to view this meetup",
      };
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      return {
        data: undefined,
        error: "You don't have permission to view this meetup",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        data: undefined,
        error: "Meetup not found",
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch meetup");
    }

    const result = await response.json();

    // Backend returns object directly or wrapped in { data: {...} }
    const meetup: Meetup = result.data || result;

    return { data: meetup, error: null };
  } catch (error: any) {
    console.error("Get meetup error:", error);
    return {
      data: undefined,
      error:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch meetup"
          : "Failed to fetch meetup. Please try again.",
    };
  }
}

