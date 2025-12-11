"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { TripRole } from "@/types/tripMembers.interface";

export async function updateMemberRole(
  planId: string,
  userId: string,
  role: TripRole
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await serverFetch.patch(
      `/trip-members/${planId}/update-role`,
      {
        body: JSON.stringify({ userId, role }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update member role",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag(`trip-members-${planId}`);

    return {
      success: true,
      message: data.message || "Member role updated successfully",
    };
  } catch (error: any) {
    console.error("Update member role error:", error);
    return {
      success: false,
      message: error.message || "Failed to update member role",
    };
  }
}

