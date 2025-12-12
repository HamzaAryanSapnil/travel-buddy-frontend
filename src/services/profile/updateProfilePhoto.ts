/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { validateImageFile } from "@/lib/file-upload";
import { revalidateTag } from "next/cache";

export const updateProfilePhoto = async (
  _currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    // Get profile image from FormData
    const profileImage = formData.get("profileImage");

    if (!profileImage || !(profileImage instanceof File)) {
      return {
        success: false,
        message: "Please select an image to upload",
        errors: [
          {
            field: "profileImage",
            message: "Profile image is required",
          },
        ],
      };
    }

    // Validate image file
    const validation = validateImageFile(profileImage);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || "Invalid image file",
        errors: [
          {
            field: "profileImage",
            message: validation.error || "Invalid image file",
          },
        ],
      };
    }

    // Create FormData for API request
    const outgoing = new FormData();
    outgoing.append("profileImage", profileImage);

    // Send request to API
    const response = await serverFetch.patch("/users/me/profile-image", {
      body: outgoing,
      // No explicit Content-Type; fetch will set multipart boundary
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

