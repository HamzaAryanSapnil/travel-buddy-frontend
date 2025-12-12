/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { MeetupStatus } from "@/types/meetup.interface";

export async function updateMeetupStatus(
  planId: string,
  meetupId: string,
  status: MeetupStatus
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(`/meetups/${meetupId}`, {
      body: JSON.stringify({ status }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Please log in to update meetup status" };
      }
      if (response.status === 403) {
        return { success: false, message: "You don't have permission to update this meetup" };
      }
      if (response.status === 404) {
        return { success: false, message: "Meetup not found" };
      }
      return {
        success: false,
        message: data.message || "Failed to update meetup status",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`plan-meetups-${planId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag(`meetup-${meetupId}`);
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("meetups-list");

    return {
      success: true,
      message: data.message || "Meetup status updated successfully",
    };
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Update meetup status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update meetup status"
          : "Failed to update meetup status. Please try again.",
    };
  }
}

