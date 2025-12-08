"use server";

import { deleteCookie } from "./tokenHandlers";

/**
 * Logout user by deleting authentication cookies
 * @returns Promise that resolves when cookies are deleted
 */
export async function logoutUser(): Promise<{ success: boolean; message?: string }> {
  try {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: error?.message || "Failed to logout",
    };
  }
}

