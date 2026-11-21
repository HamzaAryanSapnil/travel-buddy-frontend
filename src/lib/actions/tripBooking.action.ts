"use server";

import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";

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
  } catch (error: unknown) {
    console.error("Send join request error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to send join request",
    };
  }
}

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
  } catch (error: unknown) {
    console.error("Respond to request error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to respond to request",
    };
  }
}

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
  } catch (error: unknown) {
    console.error("Get my requests error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to fetch my requests",
      data: [],
    };
  }
}

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
  } catch (error: unknown) {
    console.error("Get incoming requests error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to fetch incoming requests",
      data: [],
    };
  }
}

export async function cancelRequest(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/trip-bookings/${bookingId}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel request",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag("my-requests");

    return {
      success: true,
      message: data.message || "Request cancelled successfully",
    };
  } catch (error: unknown) {
    console.error("Cancel request error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to cancel request",
    };
  }
}
