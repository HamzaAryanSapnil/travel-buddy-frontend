/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { PlanningSession } from "@/types/planner.interface";

export async function getSession(
  sessionId: string
): Promise<{ success: boolean; data?: PlanningSession; message: string }> {
  try {
    const response = await serverFetch.get(`/planner/${sessionId}`, {
      next: {
        tags: [`planner-session-${sessionId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to view the session",
        };
      }

      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to view this session",
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          message: "Session not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to fetch session",
      };
    }
    console.log("Get session data response from getSession.ts : ", data);
    return {
      success: true,
      data: data.data,
      message: data.message || "Session fetched successfully",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get session error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to fetch session"
          : "Failed to fetch session. Please try again.",
    };
  }
}

