/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import {
  AdminUsersResponse,
  AdminUserFilters,
} from "@/types/admin.interface";
import { redirect } from "next/navigation";

export async function getAllUsers(
  filters: AdminUserFilters = {}
): Promise<AdminUsersResponse> {
  try {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.status) params.set("status", filters.status);
    if (filters.role) params.set("role", filters.role);
    if (filters.search) params.set("search", filters.search);
    if (filters.active !== undefined)
      params.set("active", filters.active.toString());
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());

    const queryString = params.toString();
    const response = await serverFetch.get(
      `/users/admin${queryString ? `?${queryString}` : ""}`,
      {
        next: { tags: ["admin-users"] },
      }
    );

    // Handle 401 - redirect to login
    if (response.status === 401) {
      redirect("/login");
    }

    // Handle 403 - access denied (not admin)
    if (response.status === 403) {
      throw new Error("You don't have permission to view users");
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: true,
        message: "No users found",
        meta: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
        },
        data: [],
      };
    }

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    
    const data: AdminUsersResponse = await response.json();
    
    return data;
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Get all users error:", error);
    throw new Error(
      process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to fetch users. Please try again."
    );
  }
}

