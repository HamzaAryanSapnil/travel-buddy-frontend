/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { UpdateUserStatusResponse } from "@/types/admin.interface";
import { revalidateTag } from "next/cache";

export async function updateUserStatus(
  userId: string,
  status: "ACTIVE" | "SUSPENDED" | "DELETED",
  _currentState: any,
  formData: FormData
): Promise<UpdateUserStatusResponse> {
  try {
    const response = await serverFetch.patch(`/admin/users/${userId}/status`, {
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update user status",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update user status",
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
        message: data.message || "Failed to update user status",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    console.log("data from updateUserStatus: ", data);

    return {
      success: true,
      message: data.message || "User status updated successfully",
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Update user status error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update user status"
          : "Failed to update user status. Please try again.",
    };
  }
}

