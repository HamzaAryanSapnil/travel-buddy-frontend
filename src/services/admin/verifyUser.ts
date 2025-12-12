/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { VerifyUserResponse } from "@/types/admin.interface";
import { revalidateTag } from "next/cache";

export async function verifyUser(
  userId: string,
  isVerified: boolean
): Promise<VerifyUserResponse> {
  try {
    const response = await serverFetch.patch(`/users/admin/${userId}/verify`, {
      body: JSON.stringify({ isVerified }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to verify user",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to verify user",
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
        message: data.message || "Failed to verify user",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User verification status updated successfully",
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Verify user error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to verify user"
          : "Failed to verify user. Please try again.",
    };
  }
}

