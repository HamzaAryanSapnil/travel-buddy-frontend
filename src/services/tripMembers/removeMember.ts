"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function removeMember(
  planId: string,
  memberId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.delete(`/trip-members/${memberId}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to remove member",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag(`trip-members-${planId}`);

    return {
      success: true,
      message: data.message || "Member removed successfully",
    };
  } catch (error: any) {
    console.error("Remove member error:", error);
    return {
      success: false,
      message: error.message || "Failed to remove member",
    };
  }
}

