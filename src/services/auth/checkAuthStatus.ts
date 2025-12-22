"use server";

import { getCookie } from "./tokenHandlers";

export async function checkAuthStatus(): Promise<boolean> {
  try {
    const accessToken = await getCookie("accessToken");
    return !!accessToken;
  } catch (error) {
    console.error("Error checking auth status:", error);
    return false;
  }
}
