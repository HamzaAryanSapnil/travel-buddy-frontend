/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UpdateUserRoleResponse } from "@/types/admin.interface";
import { UserRole } from "@/lib/auth-utils";
import { revalidateTag } from "next/cache";

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResponse> {
  try {
    const response = await serverFetch.patch(`/users/admin/${userId}/role`, {
      body: JSON.stringify({ role }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update user role",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update user role",
        };
      }

      // Handle 404 - not found
      if (response.status === 404) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update user role",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User role updated successfully",
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Update user role error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update user role"
          : "Failed to update user role. Please try again.",
    };
  }
}

