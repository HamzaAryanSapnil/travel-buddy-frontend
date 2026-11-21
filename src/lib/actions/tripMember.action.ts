"use server";

import { inviteMemberSchema } from "@/zod/tripMember.validation";
import { revalidateTag } from "next/cache";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

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
  } catch (error: unknown) {
    console.error("Update member role error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to update member role",
    };
  }
}

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
  } catch (error: unknown) {
    console.error("Remove member error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to remove member",
    };
  }
}

export async function getTripMembers(
  planId: string
): Promise<TripMembersResponse> {
  try {
    const response = await serverFetch.get(`/trip-members/${planId}`, {
      next: {
        tags: [`trip-members-${planId}`],
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch trip members",
        data: [],
      };
    }

    return data;
  } catch (error: unknown) {
    console.error("Get trip members error:", error);
    return {
      success: false,
      message: (error instanceof Error ? error.message : undefined) || "Failed to fetch trip members",
      data: [],
    };
  }
}

export const addMember = async (
  planId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResponse<unknown> & { errors?: unknown }> => {
  try {
    // Extract form data
    const payload: Record<string, unknown> = {
      email: formData.get("email"),
      role: formData.get("role"),
    };

    // Remove undefined values
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === "") {
        delete payload[key];
      }
    });

    // Validate using Zod schema
    const validationResult = zodValidator(payload, inviteMemberSchema);

    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // Send request to API
    const response = await serverFetch.post(`/trip-members/${planId}/add`, {
      body: JSON.stringify(validatedPayload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Handle API errors
    if (!response.ok) {
      // Parse error messages from API
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to add member",
          errors: data.errors,
        };
      }

      // Handle field-specific errors
      if (data.message) {
        const fieldErrors: Array<{ field: string; message: string }> = [];

        // Common error patterns
        if (data.message.includes("email")) {
          fieldErrors.push({
            field: "email",
            message: data.message,
          });
        }
        if (data.message.includes("role")) {
          fieldErrors.push({
            field: "role",
            message: data.message,
          });
        }

        if (fieldErrors.length > 0) {
          return {
            success: false,
            message: data.message,
            errors: fieldErrors,
          };
        }

        return {
          success: false,
          message: data.message,
        };
      }

      return {
        success: false,
        message: "Failed to add member. Please try again.",
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch in this environment
    revalidateTag(`trip-members-${planId}`);

    return {
      success: true,
      message: data.message || "Member added successfully",
      data: data.data,
    };
  } catch (error: unknown) {
    console.error("Add member error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown error"
          : "Failed to add member. Please try again.",
    };
  }
};
