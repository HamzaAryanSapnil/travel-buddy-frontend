/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UserDashboardOverviewResponse } from "@/types/dashboard.interface";
import { redirect } from "next/navigation";

export async function getDashboardOverview(): Promise<UserDashboardOverviewResponse> {
  try {
    const response = await serverFetch.get("/dashboard/overview", {
      cache: "no-store", // Always fetch fresh data for dashboard
      next: { tags: ["dashboard-overview"] },
    });

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied
    if (response.status === 403) {
      throw new Error("You don't have permission to view the dashboard");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard overview");
    }

    const data: UserDashboardOverviewResponse = await response.json();
    return data;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get dashboard overview error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch dashboard overview. Please try again."
    );
  }
}

