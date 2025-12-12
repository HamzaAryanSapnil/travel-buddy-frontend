/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { DeleteUserResponse } from "@/types/admin.interface";
import { revalidateTag } from "next/cache";

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  try {
    const response = await serverFetch.delete(`/users/admin/${userId}`);

    // Handle 401 - unauthorized
    if (response.status === 401) {
      return {
        success: false,
        message: "Please log in to delete user",
      };
    }

    // Handle 403 - forbidden
    if (response.status === 403) {
      return {
        success: false,
        message: "You don't have permission to delete user",
      };
    }

    // Handle 404 - not found
    if (response.status === 404) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to delete user",
      };
    }

    const data = await response.json();

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("admin-users");
    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    return {
      success: true,
      message: data.message || "User deleted successfully",
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Delete user error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to delete user"
          : "Failed to delete user. Please try again.",
    };
  }
}

