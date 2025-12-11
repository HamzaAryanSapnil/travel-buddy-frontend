/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { inviteMemberSchema } from "@/zod/tripMember.validation";
import { revalidateTag } from "next/cache";

export const addMember = async (
  planId: string,
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Extract form data
    const payload: any = {
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
  } catch (error: any) {
    console.error("Add member error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to add member. Please try again.",
    };
  }
};
