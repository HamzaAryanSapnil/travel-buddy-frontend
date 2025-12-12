/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export const updateProfilePhoto = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Get profile image URL from FormData (uploaded to imgBB client-side)
    const profileImage = formData.get("profileImage")?.toString();

    if (!profileImage || !profileImage.trim()) {
      return {
        success: false,
        message: "Please upload an image",
        errors: [
          {
            field: "profileImage",
            message: "Profile image is required",
          },
        ],
      };
    }

    // Validate URL format (basic check)
    try {
      new URL(profileImage);
    } catch {
      return {
        success: false,
        message: "Invalid image URL",
        errors: [
          {
            field: "profileImage",
            message: "Invalid image URL format",
          },
        ],
      };
    }

    // Build JSON payload for API request
    const payload = {
      profileImage: profileImage,
    };

    // Send request to API with JSON
    const response = await serverFetch.patch("/users/me/profile-image", {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 - unauthorized
      if (response.status === 401) {
        return {
          success: false,
          message: "Please log in to update your profile photo",
        };
      }

      // Handle 403 - forbidden
      if (response.status === 403) {
        return {
          success: false,
          message: "You don't have permission to update this profile photo",
        };
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return {
          success: false,
          message: data.message || "Failed to update profile photo",
          errors: data.errors,
        };
      }

      // Ensure message is always a string
      const errorMessage =
        typeof data.message === "string"
          ? data.message
          : data.message && typeof data.message === "object"
          ? JSON.stringify(data.message)
          : "Failed to update profile photo";

      return {
        success: false,
        message: errorMessage,
      };
    }

    // @ts-expect-error - revalidateTag signature mismatch
    revalidateTag("user-info");

    // Ensure message is always a string
    const message =
      typeof data.message === "string"
        ? data.message
        : data.message && typeof data.message === "object"
        ? JSON.stringify(data.message)
        : "Profile photo updated successfully";

    return {
      success: true,
      message: message,
      data: data.data,
    };
  } catch (error: any) {
    // Re-throw NEXT_REDIRECT errors if any
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Update profile photo error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Failed to update profile photo"
          : "Failed to update profile photo. Please try again.",
    };
  }
};
