/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { AdminDashboardOverviewResponse } from "@/types/dashboard.interface";
import { redirect } from "next/navigation";

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverviewResponse> {
  try {
    const response = await serverFetch.get("/dashboard/admin/overview", {
      cache: "no-store", // Always fetch fresh data for dashboard
      next: { tags: ["admin-dashboard-overview"] },
    });

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view the admin dashboard");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch admin dashboard overview");
    }

    const data: AdminDashboardOverviewResponse = await response.json();
    return data;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get admin dashboard overview error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch admin dashboard overview. Please try again."
    );
  }
}

