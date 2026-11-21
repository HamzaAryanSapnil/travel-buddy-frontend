"use server";

import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";

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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Get dashboard overview error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
        : "Failed to fetch dashboard overview. Please try again."
    );
  }
}

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
  } catch (error: unknown) {
    // Re-throw NEXT_REDIRECT errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("Get admin dashboard overview error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
        : "Failed to fetch admin dashboard overview. Please try again."
    );
  }
}
